import Browser from '../../browserAPI.js';
import ScraperHelper from '../scraperHelper.js';
import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.replace(Constants.WHITESPACE, Constants.MINUS_SIGN) + Constants.CV_LIBRARY_JOBLINK_SUFFIX;

    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    const browser = await Browser.run();

    while (scrapeTracker.nOfScrapedAds < reqNofAds) {
        scrapeTracker.url = `${Constants.CV_LIBRARY_URL}/${formattedJobTitle}?&page=${scrapeTracker.currentPage}`;
        const page = await Browser.openPage(browser, scrapeTracker.url);

        const jobAdElements = await page.$$(Constants.CV_LIBRARY_JOBLINKS_SELECTOR);
        console.log("about to scrape " + scrapeTracker.url + ". " + jobAdElements.length + " job ads have been detected on the page");
        for (let i = 0; i < jobAdElements.length; i++) {
            let jobLink = Constants.CV_LIBRARY_URL + await page.evaluate((el, selector) => el.getAttribute(selector), jobAdElements[i], Constants.HREF_SELECTOR);
            jobLink = jobLink.trim();
            
            let currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            let newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: AdSource.CV_LIBRARY,
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
