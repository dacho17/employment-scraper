const browserAPI = require('../browserAPI');
const adRepository = require('../dataLayer/adRepository');
const utils = require('../utils/utils');
const formatter = require('../utils/formatter');

// NOTE: this method is tricky, make sure it works so we do not produce faulty links
function formatJobTitleForJobLink(jobTitle) {
    let changedJobTitle = jobTitle.toLowerCase().replace(/[\s+]/g, ' ');
    // changedJobTitle = changedJobTitle.replace(/\s/g, '-');
    changedJobTitle = changedJobTitle.replace(/^[a-z]^[\s]^[\d]/g,'');
    changedJobTitle = changedJobTitle.replace(/[:;()\/,\s]+/g, '-');
    changedJobTitle = changedJobTitle.replace(/[-]+/g, '-');
    return changedJobTitle + '/';
}

async function scrapeAds(requestedJobTitle, nOfAdsToBeScraped) {
    let formattedJobTitle = formatter.formatQueryWord(requestedJobTitle, ' ', '%20');
    let currentPage = 1;

    const browser = await browserAPI.runBrowser();
    let scrapedAds = [];
    let nOfScrapedAds = 0;
    while (nOfScrapedAds < nOfAdsToBeScraped) {
        let url = `https://www.jobsinnetwork.com/?query=${formattedJobTitle}?page=${currentPage}`;
        let page = await browserAPI.openPage(browser, url);

        let jobAdElements = await page.$$('.section-jobs-listing > .section-jobs-item');
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        for (let i = 0; i < jobAdElements.length; i++) {
            let companyName = await jobAdElements[i].$eval('.card-job > .card-job-header > .card-job-header-left > .card-job-info > .card-job-name', el => el.innerText);
            let companyLocation = await jobAdElements[i].$eval('.card-job > .card-job-header > .card-job-header-left > .card-job-info > .card-job-location > .card-job-country', el => el.innerText);
            let jobTitle = await jobAdElements[i].$eval('.card-job > .card-job-body > .card-job-body-title', el => el.innerText);

            let jobId = await jobAdElements[i].$eval('.card-job', el => el.getAttribute('id'));
            let jobLink = 'https://www.jobsinnetwork.com/jobs/' + formatJobTitleForJobLink(jobTitle.trim()) + jobId.trim();

            scrapedAds.push({
                source: 'JOBS_IN_NETWORK',
                jobLink: jobLink,
                jobTitle: jobTitle.trim(),
                companyName: companyName.trim(),
                companyLocation: companyLocation.trim(),
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
