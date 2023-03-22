const browserAPI = require('../browserAPI');
const adRepository = require('../dataLayer/adRepository');
const utils = require('../utils/utils');
const formatter = require('../utils/formatter');

async function scrapeAds(requestedJobTitle, nOfAdsToBeScraped) {
    let formattedJobTitle = formatter.formatQueryWord(requestedJobTitle.toLowerCase(), ' ', '-') + '-jobs';
    let currentPage = 1;

    const browser = await browserAPI.runBrowser();
    let scrapedAds = [];
    let nOfScrapedAds = 0;
    while (nOfScrapedAds < nOfAdsToBeScraped) {
        let url = `https://www.cv-library.co.uk/${formattedJobTitle}?&page=${currentPage}`;
        let page = await browserAPI.openPage(browser, url);

        let jobAdElements = await page.$$('#searchResults > .results__item');
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        for (let i = 0; i < jobAdElements.length; i++) {

            let candidateElement = await jobAdElements[i].$('article > div > h2 > a');
            if (!candidateElement) continue;

            let jobLink = 'https://www.cv-library.co.uk/' + await candidateElement.evaluate(el => el.getAttribute('href'));
            await candidateElement.dispose();

            scrapedAds.push({
                source: 'ARBEIT_NOW',
                jobLink: jobLink.trim(),
                jobTitle: null,
                companyName: null,
                companyLocation: null,
                companyLink: null,
                workLocation: null,
                jobEngagement: null,
                jobDescription: null,
                salaryInfo: null,
                postedDate: null,
                jobProps: null
            });
        }

        if (!jobAdElements || jobAdElements.length == 0) break; 

        currentPage += 1;
        nOfScrapedAds += jobAdElements.length;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browserAPI.closeBrowser(browser);
    return scrapedAds;
}

async function doAscrape(requestedJobTitle, nOfRequestedAds) {
    let scrapedAds = null
    try {
       scrapedAds = await scrapeAds(requestedJobTitle, nOfRequestedAds);
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
