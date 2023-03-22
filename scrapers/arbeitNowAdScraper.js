const browserAPI = require('../browserAPI');
const formatter = require('../utils/formatter');

const ARBEITNOW_DELIMITER = '+';
const ARBEITNOW_JOB_ADS = '#results > li';
const ARBEITNOW_JOB_LINK = 'div > .items-center > div > a';
const ARBEITNOW_SOURCE = 'ARBEITNOW';
async function scrapeAds(requestedJobTitle, nOfAdsToBeScraped) {
    let formattedJobTitle = formatter.formatQueryWord(requestedJobTitle, ' ', ARBEITNOW_DELIMITER);
    let currentPage = 1;

    const browser = await browserAPI.runBrowser();
    let scrapedAds = [];
    let nOfScrapedAds = 0;
    while (nOfScrapedAds < nOfAdsToBeScraped) {
        let url = `https://www.arbeitnow.com/?search=${formattedJobTitle}&page=${currentPage}`;
        let page = await browserAPI.openPage(browser, url);

        let jobAdElements = await page.$$(ARBEITNOW_JOB_ADS);
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        for (let i = 0; i < jobAdElements.length; i++) {

            let jobLink = await jobAdElements[i].$eval(ARBEITNOW_JOB_LINK, el => el.getAttribute('href'));

            scrapedAds.push(new JobAd(currentTimestap, currentTimestap, ARBEITNOW_SOURCE, jobLink));   // the rest is null
        }

        if (!jobAdElements || jobAdElements.length == 0) break; 

        currentPage += 1;
        nOfScrapedAds += jobAdElements.length;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browserAPI.closeBrowser(browser);
    return scrapedAds;
}

module.exports = {
    scrapeAds: scrapeAds
}
