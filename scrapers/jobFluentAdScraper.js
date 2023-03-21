const browserAPI = require('../browserAPI');
const constants = require('../constants');
const adRepository = require('../dataLayer/adRepository');
const formatter = require('../utils/formatter');
const utils = require('../utils/utils');

async function scrapeAds(nOfPagesToBeScraped) {
    let currentPage = 1;
    let url = `https://www.jobfluent.com/jobs-remote?page=${currentPage}`;

    const browser = await browserAPI.runBrowser();
    let page = await browserAPI.openPage(browser, url);

    let scrapedAds = [];
    for (let i = 0; i < nOfPagesToBeScraped; i++) {
        let jobLinkElements = await page.$$('.offer-title > a');
        // let publishedDateElements = await page.$$('.published-date');
        let listsOfSkills = await page.$$('.offer > .container-fluid > .hidden-xs');

        console.log(jobLinkElements.length, listsOfSkills.length);
        for (let j = 0; j < jobLinkElements.length; j++) {
            let jobLink = await jobLinkElements[j].evaluate(el => el.getAttribute('href'));
            let fullJobLink = 'https://www.jobfluent.com' + jobLink.trim();
    
            let jobTitle = await jobLinkElements[j].evaluate(el => el.textContent);

            // let publishedAgoText = await publishedDateElements[j].evaluate(el => el.textContent);
            // let publishedDate = utils.getPostedDate4CareerJet(publishedAgoText);
            // publishedDate = utils.transformToTimestamp(publishedDate);

            let children = await page.$eval('.container', e => {
                const data = [];
                for (const child of e.children) {
                    data.push({ tagName: child.tagName, innerText: child.innerText });
                }
                return data;
            });

            let jobProps = await listsOfSkills[j].$$eval('a', nodes => nodes.map(el => el.innerText));

            scrapedAds.push({
                source: 'JOB_FLUENT',
                jobLink: fullJobLink,
                jobTitle: jobTitle,
                companyName: null,
                companyLocation: null,
                workLocation: null,
                jobEngagement: null,
                jobDescription: null,
                salaryInfo: null,
                postedDate: null,
                jobProps: jobProps.join(' ')
            });
        }

        currentPage += 1;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browserAPI.closeBrowser(browser);
    return scrapedAds;
}


async function doAscrape(nOfPagesToBeScraped) {
    let scrapedAds = null
    try {
       scrapedAds = await scrapeAds(nOfPagesToBeScraped);
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
