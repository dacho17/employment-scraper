const browserAPI = require('../browserAPI');
const adRepository = require('../dataLayer/adRepository');
const utils = require('../utils/utils');
const formatter = require('../utils/formatter');


async function scrapeAds(requestedJobTitle, nOfPagesToBeScraped) {
    let formattedJobTitle = formatter.formatQueryWord(requestedJobTitle, ' ', '%20');
    let currentPage = 1;
    
    const browser = await browserAPI.runBrowser();
    let scrapedAds = [];
    while (currentPage <= nOfPagesToBeScraped) {
        let url = `https://www.adzuna.com/search?q=${formattedJobTitle}&p=${currentPage}`;
        let page = await browserAPI.openPage(browser, url);

        let jobAdElements = await page.$$('.ui-search-results > div[data-aid] > .w-full');
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        for (let j = 0; j < jobAdElements.length; j++) {
            let jobLink = await jobAdElements[j].$eval('.flex.gap-4 > h2 > a', el => el.getAttribute('href'));

            let jobTitleElements = await jobAdElements[j].$$('.flex.gap-4 > h2 > a > strong');
            let jobTitleParts = await Promise.all(jobTitleElements.map(async jobTitleElement => await jobTitleElement.evaluate(el => el.innerText)));
            jobTitleElements.forEach(async elem => await elem.dispose());
            let jobTitle = jobTitleParts.join(' ').trim();
    
            // let companyLink = await jobAdElements[j].$('div:nth-child(2) > div:nth-child(1) > a');    // .ui-job-card-info > div.ui-company > a , el => el.getAttribute('href'));
            // let companyName = await jobAdElements[j].$eval('div.ui-job-card-info > div.ui-company > a', el => el.innerText);

            let companyLocation = await jobAdElements[j].$eval('.ui-location', el => el.innerText);
    
            let salaryEstimation = await jobAdElements[j].$eval('.ui-salary > a > span:first-child', el => el.innerText);
            let salaryInfo = `Estimated ${salaryEstimation} USD`;
    
            scrapedAds.push({
                source: 'ADZUNA',
                jobLink: jobLink,
                jobTitle: jobTitle,
                companyName: null,  // for some reason unknown to me I cannot scrape this
                companyLocation: companyLocation.trim(),
                companyLink: null,  // for some reason unknown to me I cannot scrape this
                workLocation: null,
                jobEngagement: null,
                jobDescription: null,
                salaryInfo: salaryInfo,
                postedDate: null,
                jobProps: null
            });
        }

        currentPage += 1;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browserAPI.closeBrowser(browser);
    return scrapedAds;
}

async function doAscrape(requestedJobTitle, nOfPagesToBeScraped) {
    let scrapedAds = null
    try {
       scrapedAds = await scrapeAds(requestedJobTitle, nOfPagesToBeScraped);
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
