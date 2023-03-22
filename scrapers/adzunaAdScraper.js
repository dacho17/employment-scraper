const browserAPI = require('../browserAPI');
const { JobAd } = require('../models/JobAd');
const formatter = require('../utils/formatter');
const utils = require('../utils/utils');

const ADZUNA_SELECTOR_JOB_ADS = '.ui-search-results > div[data-aid] > .w-full';
const ADZUNA_SELECTOR_JOB_LINK = '.flex.gap-4 > h2 > a';
const ADZUNA_SOURCE = 'ADZUNA';
const ADZUNA_DELIMITER = '%20';

async function scrapeAds(requestedJobTitle, nOfPagesToBeScraped) {
    let formattedJobTitle = formatter.formatQueryWord(requestedJobTitle, ' ', ADZUNA_DELIMITER);
    let currentPage = 1;
    
    const browser = await browserAPI.runBrowser();
    let scrapedAds = [];
    while (currentPage <= nOfPagesToBeScraped) {
        let url = `https://www.adzuna.com/search?q=${formattedJobTitle}&p=${currentPage}`;
        let page = await browserAPI.openPage(browser, url);

        let jobAdElements = await page.$$(ADZUNA_SELECTOR_JOB_ADS);
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        for (let j = 0; j < jobAdElements.length; j++) {
            let jobLink = await jobAdElements[j].$eval(ADZUNA_SELECTOR_JOB_LINK, el => el.getAttribute('href'));
    
            let currentTimestap = utils.transformToTimestamp(new Date(Date.now));
            scrapedAds.push(new JobAd(currentTimestap, currentTimestap, ADZUNA_SOURCE, jobLink));   // the rest is null
        }

        currentPage += 1;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browserAPI.closeBrowser(browser);
    return scrapedAds;
}

module.exports = {
    scrapeAds: scrapeAds
}
