// I get a response that I have no access to the page


import ScraperHelper from '../scraperHelper.js'
import Constants from '../../constants.js';
import Browser from '../../browserAPI.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import Utils from '../../utils/utils.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number, reqJobLocation: string): Promise<JobAd[]> {
    const jobTitle = reqJobTitle.replace(Constants.WHITESPACE, Constants.PLUS_SIGN);
    const jobLocation = reqJobLocation.replace(Constants.WHITESPACE, Constants.PLUS_SIGN).replace(Constants.COMMA, Constants.ASCII_COMMA_SIGN_ENCODING);

    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    const browser = await Browser.run();
    while (scrapeTracker.nOfScrapedAds < reqNofAds) {
        scrapeTracker.url = `${Constants.INDEED_URL}/jobs?q=${jobTitle}&l=${jobLocation}&start=${scrapeTracker.nOfScrapedAds}`
        const page = await Browser.openPage(browser, scrapeTracker.url);

        const jobCards = await page.$$('job-cards');
        const japan = await page.$$('#jobsearch-JapanPage');
        const resultList = await page.$$('.jobsearch-ResultsList');
        console.log(jobCards.length);
        console.log(japan.length);
        console.log(resultList.length);
        console.log(await page.content());
        const jobAdElements = await page.$$(Constants.INDEED_JOBLINKS_SELECTOR);
        console.log("about to scrape " + scrapeTracker.url + ". " + jobAdElements.length + " job ads have been detected on the page");
        for (let i = 0; i < jobAdElements.length; i++) {
            let jobLink = Constants.INDEED_URL + await page.evaluate((el, selector) => el.getAttribute(selector), jobAdElements[i], Constants.HREF_SELECTOR);
            jobLink = jobLink.trim();
            
            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            const newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: AdSource.INDEED,
                jobLink: jobLink
            };
            scrapeTracker.scrapedAds.push(newAd);
        }

        if (!jobAdElements || jobAdElements.length == 0) break; 
        scrapeTracker.currentPage += 1;
        scrapeTracker.nOfScrapedAds += jobAdElements.length;
    }

    console.log(scrapeTracker.scrapedAds.length + " ads have been scraped in total.");

    await Browser.close(browser);
    return scrapeTracker.scrapedAds;
}


/*  IF I WANT TO MAKE MY OWN INDEED SCRAPER THIS IS THE WAY:
jobSelector -> '.jobsearch-ResultsList > li'
jobLink -> '.jobTitle > a[href]'
jobTitle -> 'span > .title'
companyName -> '.companyOverviewLink'
companyLink -> '.companyOverviewLink [href]'
companyLocation -> '.companyLocation' + '.companyLocation--extras'
salaryInfo -> '.salary-snippet-container > .attribute_snippet text'
jobProps -> '.salaryOnly > metadata > attribute_snippet text'
postedDate -> '.result-footer > .date'
*/