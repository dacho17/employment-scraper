const browserAPI = require('../browserAPI');
const formatter = require('../utils/formatter');

const ADS_PER_PAGE = 10;
const TYBA_SELECTOR_JOB_ADS = '#timeline > .section-view-list > .bem-enabled > a';
const TYBA_DELIMITER = '%20';
const TYBA_URL = 'https://tyba.com'
const TYBA_SELECTOR_JOB_TITLE = '.job-box__text > .job-box__heading';
const TYBA_SELECTOR_COMPANY_NAME = '.job-box__text > div > .job-box__company-name';
const TYBA_SOURCE = 'TYBA';

async function scrapeAds(requestedJobTitle, nOfAdsToBeScraped) {
    let formattedJobTitle = formatter.formatQueryWord(requestedJobTitle, ' ', TYBA_DELIMITER);
    let currentPage = 1;
    
    const browser = await browserAPI.runBrowser();
    let scrapedAds = [];
    while ((currentPage - 1) * ADS_PER_PAGE < nOfAdsToBeScraped) {
        let url = `${TYBA_URL}/jobs?keyword=${formattedJobTitle}r&limit=10&offset=${(currentPage - 1) * ADS_PER_PAGE}`;
        let page = await browserAPI.openPage(browser, url);

        let jobAdElements = await page.$$(TYBA_SELECTOR_JOB_ADS);
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        for (let j = 0; j < jobAdElements.length; j++) {
            let jobLink = await jobAdElements[j].evaluate(el => el.getAttribute('href'));
            let fullJobLink = TYBA_URL + jobLink.trim();

            let jobTitle = await jobAdElements[j].$eval(TYBA_SELECTOR_JOB_TITLE, el => el.innerText);
            let companyName = await jobAdElements[j].$eval(TYBA_SELECTOR_COMPANY_NAME, el => el.innerText);
            
            // let texts = await jobAdElements[j].$$eval('div', el => el.innerText);
            // console.log(texts); // should contain (jobEngagement, companyLocation)

            scrapedAds.push({
                source: TYBA_SOURCE,
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
