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
        let url = `https://tyba.com/jobs?keyword=${formattedJobTitle}r&limit=10&offset=${(currentPage-1) * PAGE_OFFSET}`;
        let page = await browserAPI.openPage(browser, url);

        let jobAdElements = await page.$$('#timeline > .section-view-list > .bem-enabled > a');
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        for (let j = 0; j < jobAdElements.length; j++) {
            let jobLink = await jobAdElements[j].evaluate(el => el.getAttribute('href'));
            let fullJobLink = 'https://tyba.com' + jobLink.trim();

            let jobTitle = await jobAdElements[j].$eval('.job-box__text > .job-box__heading', el => el.innerText);
            let companyName = await jobAdElements[j].$eval('.job-box__text > div > .job-box__company-name', el => el.innerText);
            
            // let texts = await jobAdElements[j].$$eval('div', el => el.innerText);
            // console.log(texts); // should contain (jobEngagement, companyLocation)

            scrapedAds.push({
                source: 'TYBA',
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
