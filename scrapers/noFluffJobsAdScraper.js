const browserAPI = require('../browserAPI');
const adRepository = require('../dataLayer/adRepository');
const utils = require('../utils/utils');
const formatter = require('../utils/formatter');

const PAGE_OFFSET = 10;

async function scrapeAds(requestedJobTitle, nOfAdsToBeScraped) {
    let formattedJobTitle = formatter.formatQueryWord(requestedJobTitle, ' ', '%20');
    let currentPage = 1;

    const browser = await browserAPI.runBrowser();
    let scrapedAds = [];
    while ((currentPage - 1) * PAGE_OFFSET < nOfAdsToBeScraped) {
        let url = `https://nofluffjobs.com/${formattedJobTitle}?page=${currentPage}`;
        let page = await browserAPI.openPage(browser, url);

        let jobAdElements = await page.$$('.list-container > .posting-list-item');
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        for (let i = 0; i < jobAdElements.length; i++) {
            let jobLink = await jobAdElements[i].evaluate(el => el.getAttribute('href'));
            let fullJobLink = 'https://nofluffjobs.com' + jobLink.trim();

            let companyName = await jobAdElements[i].$eval('nfj-posting-item-title > .posting-title__wrapper > .posting-title__company', el => el.innerText);
            let jobTitle = await jobAdElements[i].$eval('nfj-posting-item-title > .posting-title__wrapper > div > .posting-title__position', el => el.innerText);

            scrapedAds.push({
                source: 'NO_FLUFF_JOBS',
                jobLink: fullJobLink,
                jobTitle: jobTitle,
                companyName: companyName.trim(),
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

        currentPage += 1;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browserAPI.closeBrowser(browser);
    return scrapedAds;
}

module.exports = {
    scrapeAds: scrapeAds
}
