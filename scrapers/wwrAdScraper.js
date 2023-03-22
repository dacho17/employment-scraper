const browserAPI = require('../browserAPI');
const constants = require('../constants');
const adRepository = require('../dataLayer/adRepository');
const formatter = require('../utils/formatter');
const utils = require('../utils/utils');

async function scrapePartOfAds(jobAdElements, scrapedAds) {
    for (let j = 0; j < jobAdElements.length; j++) {
        let jobLink = await jobAdElements[j].$eval('a', el => el.getAttribute('href'));
        let fullJobLink = 'https://weworkremotely.com' + jobLink;
        let jobTitle = await jobAdElements[j].$eval('a > .title', el => el.textContent);

        let tupleElement = await jobAdElements[j].$$('a > .company');
        let companyName = await tupleElement[0].evaluate(el => el.innerText)
        let jobEngagement = await tupleElement[1].evaluate(el => el.innerText);
        let companyLink = await jobAdElements[j].$eval('.tooltip > a', el => el.getAttribute('href'));
        let fullCompanyLink = 'https://weworkremotely.com' + companyLink;

        let workLocationElement = await jobAdElements[j].$('a > .region.company');
        let workLocation = null;
        if (workLocationElement) {
            workLocation = await workLocationElement.evaluate(el => el.innerText);
            workLocation = workLocation.trim();
        }

        let postedDate = new Date(Date.now());  // featured - so it must be fresh
        let postedDateElement = await jobAdElements[j].$('a > .date > time');
        if (postedDateElement) {
            postedDate = await postedDateElement.evaluate(el => el.getAttribute('datetime'));
        }
        postedDate = utils.transformToTimestamp(postedDate);

        scrapedAds.push({
            source: 'WE_WORK_REMOTELY',
            jobLink: fullJobLink,
            jobTitle: jobTitle.trim(),
            companyName: companyName.trim(),
            companyLocation: null,
            companyLink: fullCompanyLink.trim(),
            workLocation: workLocation,
            jobEngagement: jobEngagement.trim(),
            jobDescription: null,
            salaryInfo: null,
            postedDate: postedDate,
            jobProps: null
        });
    }
}

async function scrapeAds() {
    const browser = await browserAPI.runBrowser();
    let page = await browserAPI.openPage(browser, 'https://weworkremotely.com/remote-jobs/');   // url containing hrefs to all the jobs we are going to scrape

    let scrapedAds = [];
    let jobSectionElements = await page.$$('.jobs-container > .jobs');
    let showAllJobsUrls = [];
    
    // scrape directly from the main page those who do not have .view-all. Otherwise access the separate urls and scrape from there
    let sectionsToBeScrapedFromMain = [];
    for (let i = 0; i < jobSectionElements.length; i++) {
        let jobUrlElement = await jobSectionElements[i].$('article > ul > .view-all > a');
        if (jobUrlElement === null) {
            sectionsToBeScrapedFromMain.push(i);
            continue;
        }

        let newUrl = 'https://weworkremotely.com' + await jobUrlElement.evaluate(el => el.getAttribute('href'));
        showAllJobsUrls.push(newUrl.trim());
    }
    // scraping the pages other than the main one (the ones with higher number of ads)
    console.log(showAllJobsUrls.length + " job pages will be scraped.");

    // scraping the main page
    let jobAdsOnMainPage = [];
    let allJobSections = await page.$$(`.jobs-container > .jobs`);
    for (let i = 0; i < sectionsToBeScrapedFromMain.length; i++) {
        // let jobSectionFromMainPage = await page.$(`.jobs-container > .jobs:nth-child(${sectionsToBeScrapedFromMain[i].toString()})`); //   > article > ul
        let jobAdElements = await allJobSections[sectionsToBeScrapedFromMain[i]].$$('li');
        jobAdsOnMainPage.push(...jobAdElements);
    }
    console.log(jobAdsOnMainPage.length + " jobs have been found on the main page");
    

    console.log("starting to scrape the main page");
    await scrapePartOfAds(jobAdsOnMainPage, scrapedAds);
    console.log(scrapedAds.length + ' jobs have been scraped from the main page');

    console.log("starting to scrape separate pages");
    for (let i = 0; i < showAllJobsUrls.length; i++) {
        page = await browserAPI.openPage(browser, showAllJobsUrls[i]);

        let jobAdElements = await page.$$('.jobs > article > ul > li'); // not the first and the last one
        jobAdElements.shift();
        jobAdElements.pop();
        console.log(jobAdElements.length + ' jobs found on the page ' + showAllJobsUrls[i]);
        await scrapePartOfAds(jobAdElements, scrapedAds);
    }

    console.log(scrapedAds.length + " jobs have been scraped in total.");

    await browserAPI.closeBrowser(browser);
    return scrapedAds;
}

async function doAscrape() {
    let scrapedAds = null
    try {
       scrapedAds = await scrapeAds();
    } catch (exception) {
      console.log(exception.message);
      return {
          statusCode: 500,
          message: exception.message
      }
    }

    try {
        adRepository.storeAdsToDB(scrapedAds);
        return {
            statusCode: 200,
            message: 'Ads scraped and stored into the database successfully!'
        }
      } catch (exception) {
        return {
            statusCode: 500,
            message: exception.message
        }
    }
}

module.exports = {
    doAscrape: doAscrape
}
