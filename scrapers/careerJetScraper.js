const browserAPI = require('../browserAPI');
const adRepository = require('../dataLayer/adRepository');
const utils = require('../utils/utils');
const formatter = require('../utils/formatter');
const constants = require('../constants');

async function scrapeAds(nOfPagesToBeScraped, requestedJobTitle, requestedJobLocation) {
    let formattedJobTitle = formatter.formatQueryWord(requestedJobTitle, ' ', '+');
    let formattedJobLocation = formatter.formatQueryWord(requestedJobLocation, ' ', '+');
    let currentPage = 1;
    let url = `https://www.careerjet.com/search/jobs?s=${formattedJobTitle}&l=${formattedJobLocation}&p=${currentPage}`;

    const browser = await browserAPI.runBrowser();
    let page = await browserAPI.openPage(browser, url);

    let scrapedAds = [];
    for (let i = 0; i < nOfPagesToBeScraped; i++) {
        let jobLinkElements = await page.$$('.job.clicky > header > h2 > a');
        let companyNameElements = await page.$$('.company');
        let companyLocationElements = await page.$$('.location > li');
        let jobDescriptionElements = await page.$$('.desc');
        let daysAgoElements = await page.$$('.tags > li:first-child > span');
        console.log(jobLinkElements.length, companyNameElements.length, companyLocationElements.length, jobDescriptionElements.length, daysAgoElements.length);

        for (let j = 0; j < jobLinkElements.length; j++) {
            let jobLink = await jobLinkElements[j].evaluate(el => el.getAttribute('href'));
            let fullJobLink = 'https://www.careerjet.com' + jobLink.trim();
    
            let jobTitle = await jobLinkElements[j].evaluate(el => el.textContent);

            let companyName = await companyNameElements[j].evaluate(el => el.textContent);
            let companyNameFormatted = formatter.formatEntry(companyName);

            let companyLocation = await companyLocationElements[j].evaluate(el => el.textContent);
            let companyLocationFormatted = formatter.formatEntry(companyLocation);

            let salaryInfo = constants.UNDISCLOSED_SALARY;

            let jobDescription = await jobDescriptionElements[j].evaluate(el => el.textContent);
            jobDescription = formatter.formatEntry(jobDescription);

            let publishedAgo = await daysAgoElements[j].evaluate(el => el.textContent);
            let publishedDate = utils.getPostedDate4CareerJet(publishedAgo);
            publishedDate = utils.transformToTimestamp(publishedDate);

            scrapedAds.push({
                source: 'CAREER_JET',
                jobLink: fullJobLink,
                jobTitle: jobTitle,
                companyName: companyNameFormatted,
                companyLocation: companyLocationFormatted,
                workLocation: null,
                jobEngagement: null,
                jobDescription: jobDescription,
                salaryInfo: salaryInfo,
                postedDate: publishedDate,
                jobProps: null
            });
        }

        currentPage += 1;
    }
    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browserAPI.closeBrowser(browser);
    return scrapedAds;
}

async function doAscrape(nOfPagesToBeScraped, requestedJobTitle, requestedJobLocation) {
    let scrapedAds = null
    try {
       scrapedAds = await scrapeAds(nOfPagesToBeScraped, requestedJobTitle, requestedJobLocation);
    } catch (exception) {
      console.log(exception.message);
      return {
          statusCode: 500,
          message: exception.message
      }
    }

    try {
        adRepository.storeAdsToDB(scrapedAds);
        adRepository.storeAdDetails(scrapedAds);
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
