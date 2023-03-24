import Browser from '../../browserAPI.js';
import ScraperHelper from '../scraperHelper.js';
import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number, reqJobLocation: string): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.replace(Constants.WHITESPACE, Constants.PLUS_SIGN);
    const formattedJobLocation = reqJobLocation.replace(Constants.WHITESPACE, Constants.PLUS_SIGN).replace(Constants.COMMA, Constants.ASCII_COMMA_SIGN_ENCODING);

    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    scrapeTracker.url = `${Constants.SIMPLY_HIRED_URL}/search?q=${formattedJobTitle}&l=${formattedJobLocation}`;
    const browser = await Browser.run();
    while (scrapeTracker.nOfScrapedAds < reqNofAds) {
        let page = await Browser.openPage(browser, scrapeTracker.url);
        const jobLinkElements = await page.$$(Constants.SIMPLY_HIRED_JOBLINKS_SELECTOR);
        for (let j = 0; j < jobLinkElements.length; j++) {
            let jobLink = await page.evaluate((el, selector) => el.getAttribute(selector), jobLinkElements[j], Constants.HREF_SELECTOR);
            jobLink = Constants.SIMPLY_HIRED_URL + jobLink.trim();

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            const newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: AdSource.SIMPLY_HIRED,
                jobLink: jobLink
            };
            scrapeTracker.scrapedAds.push(newAd);
        }

        if (!jobLinkElements || jobLinkElements.length == 0) break; 
        scrapeTracker.currentPage += 1;
        scrapeTracker.nOfScrapedAds += jobLinkElements.length;
        
        const navigationButtons = await page.$$(Constants.SIMPLY_HIRED_NAVIGATION_BUTTONS_SELECTOR);
        for (let i = 0; i < navigationButtons.length; i++) {
            const [candidateButtonPageContent, candidateUrl] = await page.evaluate((el, selectorOne, selectorTwo) => 
                [el.getAttribute(selectorOne), el.getAttribute(selectorTwo)],
                    navigationButtons[i], Constants.ARIALABEL_SELECTOR, Constants.HREF_SELECTOR);
            const pageElementSegments = candidateButtonPageContent.split(Constants.WHITESPACE);
            if (isNaN(parseInt(pageElementSegments[1]))) continue;
            if (parseInt(pageElementSegments[1]) == scrapeTracker.currentPage) {
                scrapeTracker.url = candidateUrl;
                break;
            }
        }
        page = await Browser.openPage(browser, scrapeTracker.url);
    }

    await Browser.close(browser);
    return scrapeTracker.scrapedAds;
}
