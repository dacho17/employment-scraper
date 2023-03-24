import Browser from "../../browserAPI";
import Constants from '../../constants';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';
import ScraperHelper from "../scraperHelper";

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.trim().replace(Constants.WHITESPACE, Constants.PLUS_SIGN);
    
    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    const browser = await Browser.run();
    while (scrapeTracker.nOfScrapedAds <= reqNofAds) {
        scrapeTracker.url = `https://eurojobs.com/search-results-jobs/?action=search&listing_type%5Bequal%5D=Job&keywords%5Ball_words%5D=${formattedJobTitle}&page=${scrapeTracker.currentPage}&view=list`;
        let page = await Browser.openPage(browser, scrapeTracker.url);

        const jobAdElements = await page.$$(Constants.EURO_JOBS_JOBLINKS_SELECTOR);
        for (let j = 0; j < jobAdElements.length; j++) {
            let jobLink = await page.evaluate((el, selector) => el.getAttribute(selector), jobAdElements[j], Constants.HREF_SELECTOR);

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            let newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: AdSource.EURO_JOBS,
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
