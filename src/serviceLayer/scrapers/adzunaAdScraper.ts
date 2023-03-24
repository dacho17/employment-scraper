import Browser from '../../browserAPI.js';
import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';
import ScraperHelper from '../scraperHelper.js';

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.trim().replace(Constants.WHITESPACE, Constants.WHITESPACE_URL_ENCODING);

    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    const browser = await Browser.run();
    while (scrapeTracker.nOfScrapedAds <= reqNofAds) {
        scrapeTracker.url = `https://www.adzuna.com/search?q=${formattedJobTitle}&p=${scrapeTracker.currentPage}`;
        let page = await Browser.openPage(browser, scrapeTracker.url);

        const jobAdElements = await page.$$(Constants.ADZUNA_JOBLINKS_SELECTOR);
        for (let j = 0; j < jobAdElements.length; j++) {
            let jobLink = await page.evaluate((el, selector) => el.getAttribute(selector), jobAdElements[j], Constants.HREF_SELECTOR);
            jobLink = jobLink.trim();

            let currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            let newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: AdSource.ADZUNA,
                jobLink: jobLink
            }
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
