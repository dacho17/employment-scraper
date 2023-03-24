import Browser from '../../browserAPI.js';
import ScraperHelper from '../scraperHelper.js'
import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.trim().replace(Constants.WHITESPACE, Constants.WHITESPACE_URL_ENCODING);

    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    const browser = await Browser.run();
    while (scrapeTracker.nOfScrapedAds < reqNofAds) {
        scrapeTracker.url = `${Constants.NO_FLUFF_JOBS_URL}/${formattedJobTitle}?page=${scrapeTracker.currentPage}`;
        const page = await Browser.openPage(browser, scrapeTracker.url);

        const jobAdElements = await page.$$(Constants.NO_FLUFF_JOBS_JOBLINKS_SELECTOR);
        for (let i = 0; i < jobAdElements.length; i++) {
            let jobLink = await page.evaluate((el, selector) => el.getAttribute(selector), jobAdElements[i], Constants.HREF_SELECTOR);
            jobLink = Constants.NO_FLUFF_JOBS_URL + jobLink.trim();

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            const newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: AdSource.NO_FLUFF_JOBS,
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
