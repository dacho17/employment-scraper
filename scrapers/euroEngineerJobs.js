const browserAPI = require('../browserAPI');
const adRepository = require('../dataLayer/adRepository');
const utils = require('../utils/utils');
const formatter = require('../utils/formatter');

async function scrapeAds(requestedJobTitle) {
    let formattedJobTitle = formatter.formatQueryWord(requestedJobTitle.toLowerCase(), ' ', '_');

    const browser = await browserAPI.runBrowser();
    let scrapedAds = [];
    let nOfScrapedAds = 0;
        
    let url = `https://www.euroengineerjobs.com/job_search/keyword/${formattedJobTitle}`;
    let page = await browserAPI.openPage(browser, url);

    let jobAdElements = await page.$$('.searchList > li');
    console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
    for (let i = 0; i < jobAdElements.length; i++) {

        let candidateElement = await jobAdElements[i].$('div > div > div > a');
        if (!candidateElement) candidateElement = await jobAdElements[i].$('div > div > div > div > div > h3 > a');
        if (!candidateElement) continue;

        let jobLink = 'https://www.euroengineerjobs.com' + await candidateElement.evaluate(el => el.getAttribute('href'));
        await candidateElement.dispose();

        scrapedAds.push({
            source: 'EURO_ENGINEER_JOBS',
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

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browserAPI.closeBrowser(browser);
    return scrapedAds;
}

module.exports = {
    scrapeAds: scrapeAds
}
