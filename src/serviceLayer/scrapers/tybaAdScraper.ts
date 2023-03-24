import Browser from '../../browserAPI.js';
import ScraperHelper from '../scraperHelper.js';
import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.replace(Constants.WHITESPACE, Constants.WHITESPACE_URL_ENCODING);

    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    const browser = await Browser.run();
    while (scrapeTracker.nOfScrapedAds < reqNofAds) {
        scrapeTracker.url = `${Constants.TYBA_URL}/jobs?keyword=${formattedJobTitle}r&limit=10&offset=${scrapeTracker.nOfScrapedAds}`;
        const page = await Browser.openPage(browser, scrapeTracker.url);

        const jobLinkElements = await page.$$(Constants.TYBA_JOBLINKS_SELECTOR);
        for (let j = 0; j < jobLinkElements.length; j++) {
            let jobLink = await page.evaluate((el, selector) => el.getAttribute(selector), jobLinkElements[j], Constants.HREF_SELECTOR);
            jobLink = Constants.TYBA_URL + jobLink.trim();

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            const newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: AdSource.TYBA,
                jobLink: jobLink
            };
            scrapeTracker.scrapedAds.push(newAd);
        }
        
        if (!jobLinkElements || jobLinkElements.length == 0) break; 
        scrapeTracker.currentPage += 1;
        scrapeTracker.nOfScrapedAds += jobLinkElements.length;
    }

    console.log(scrapeTracker.scrapedAds.length + " ads have been scraped in total.");
    
    await Browser.close(browser);
    console.log(scrapeTracker.scrapedAds[0]);
    return scrapeTracker.scrapedAds;
}
