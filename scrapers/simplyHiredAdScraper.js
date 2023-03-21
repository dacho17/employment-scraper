const browserAPI = require('../browserAPI');
const constants = require('../constants');
const adRepository = require('../dataLayer/adRepository');
const formatter = require('../utils/formatter');
const utils = require('../utils/utils');

async function scrapeAds(nOfPagesToBeScraped, requestedJobTitle, requestedJobLocation) {
    let formattedJobTitle = formatter.formatQueryWord(requestedJobTitle, ' ', '+');
    let formattedJobLocation = formatter.formatQueryWord(formatter.formatQueryWord(requestedJobLocation, ' ', '+'), ',', '%2C');
    let url = `https://www.simplyhired.com/search?q=${formattedJobTitle}&l=${formattedJobLocation}`;

    const browser = await browserAPI.runBrowser();
    let page = await browserAPI.openPage(browser, url);

    let scrapedAds = [];
    let currentPage = 1;
    for (let i = 0; i < nOfPagesToBeScraped; i++) {
        console.log(i); // TODO: test clicking on the page!

        let jobLinkElements = await page.$$('h3[data-testid="searchSerpJobTitle"] > a');
        let companyNameElements = await page.$$('span[data-testid="companyName"]');
        let companyLocationElements = await page.$$('span[data-testid="searchSerpJobLocation"]');
        // let postedDateTextElements = await page.$$('p[data-testid="searchSerpJobDateStamp"]'); not on each entry, not straightforward to map dates to entries
        let jobDescriptionElements = await page.$$('p[data-testid="searchSerpJobSnippet"]');

        for (let j = 0; j < jobLinkElements.length; j++) {
            let jobLink = await jobLinkElements[j].evaluate(el => el.getAttribute('href'));
            let fullJobLink = 'https://www.simplyhired.com' + jobLink.trim();
    
            let jobTitle = await jobLinkElements[j].evaluate(el => el.textContent);

            let companyName = await companyNameElements[j].evaluate(el => el.textContent);
            let companyNameFormatted = formatter.formatEntry(companyName);

            let companyLocation = await companyLocationElements[j].evaluate(el => el.textContent);
            let companyLocationFormatted = formatter.formatEntry(companyLocation);

            let salaryInfo = constants.UNDISCLOSED_SALARY; // The salaries disclosed on this webpage are estimations

            // let postedDateText = await browserAPI.getDataFrom(page, 'p[data-testid="searchSerpJobDateStamp"]');
            // let postedDateText = await postedDateTextElements[j].evaluate(el => el.textContent);
            // let postedDate = utils.getPostedDate4SimplyHired(postedDateText);
            // postedDate = utils.transformToTimestamp(postedDate);

            let jobDescription = await jobDescriptionElements[j].evaluate(el => el.textContent);
            jobDescription = formatter.formatEntry(jobDescription);


            scrapedAds.push({
                source: 'SIMPLY_HIRED',
                jobLink: fullJobLink,
                jobTitle: jobTitle,
                companyName: companyNameFormatted,
                companyLocation: companyLocationFormatted,
                workLocation: null,
                jobEngagement: null,
                jobDescription: jobDescription,
                salaryInfo: salaryInfo,
                postedDate: null,   // postedDate
                jobProps: null
            });
        }

        console.log(scrapedAds.length);
        
        const navigationButtons = await page.$$('nav[aria-label="pagination navigation"] > a');
        for (let i = 0; i < navigationButtons.length; i++) {
            let candidateButton = await navigationButtons[i].evaluate(el => el.getAttribute('aria-label'));
            if (parseInt(candidateButton.split(' ')[1]) == currentPage + 1) {
                url = await navigationButtons[i].evaluate(el => el.getAttribute('href'));
                page = await browserAPI.openPage(browser, url);
                currentPage += 1;
            }
        }
    }

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
