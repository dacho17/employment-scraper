import Browser from "../../browserAPI";
import Constants from "../../constants";
import { AdSource } from "../../dataLayer/enums/adSource";
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from "../../utils/utils";

export default async function scrapeAds(nOfAdsToBeScraped: number, requestedJobTitle: string, requestedJobLocation: string): Promise<JobAd[]> {
    const formattedJobTitle = requestedJobTitle.replace(Constants.WHITESPACE, Constants.PLUS_SIGN);
    const formattedJobLocation = requestedJobLocation.replace(Constants.WHITESPACE, Constants.PLUS_SIGN).replace(Constants.COMMA, Constants.ASCII_COMMA_SIGN_ENCODING);

    const browser = await (new Browser()).run();
    let url = `https://www.simplyhired.com/search?q=${formattedJobTitle}&l=${formattedJobLocation}`;
    await browser.openPage(url);

    const scrapedAds: JobAd[] = [];
    let nOfScrapedAds = 0;
    let jobLinkElements = null;
    let currentPage = 1;
    while (nOfScrapedAds < nOfAdsToBeScraped) { // TODO: button clicking has not been tested!
        jobLinkElements = await browser.page.$$(Constants.SIMPLY_HIRED_JOBLINKS_SELECTOR);
        
        let jobLink = null;
        const newAd: JobAd = {
            createdDate: null,
            updatedDate: null,
            source: null,
            jobLink: null
        };
        for (let j = 0; j < jobLinkElements.length; j++) {
            jobLink = await jobLinkElements[j].evaluate(el => el.getAttribute(Constants.HREF_SELECTOR));
            jobLink = 'https://www.simplyhired.com' + jobLink.trim();

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            newAd.createdDate = currentTimestap;
            newAd.updatedDate = currentTimestap;
            newAd.source = AdSource.SIMPLY_HIRED;
            newAd.jobLink = jobLink;
            scrapedAds.push(newAd);
        }

        if (!jobLinkElements || jobLinkElements.length == 0) break;
        nOfScrapedAds += jobLinkElements.length;
        currentPage += 1;
        
        const navigationButtons = await browser.page.$$(Constants.SIMPLY_HIRED_NAVIGATION_BUTTONS_SELECTOR);
        let candidateButtonPageContent = null;
        let pageElementSegments = null;
        for (let i = 0; i < navigationButtons.length; i++) {
            candidateButtonPageContent = await navigationButtons[i].evaluate(el => el.getAttribute(Constants.ARIALABEL_SELECTOR));
            pageElementSegments = candidateButtonPageContent.split(Constants.WHITESPACE);
            if (isNaN(parseInt(pageElementSegments.split(Constants.WHITESPACE)[1]))) continue;
            if (parseInt(pageElementSegments.split(Constants.WHITESPACE)[1]) == currentPage) {
                url = await navigationButtons[i].evaluate(el => el.getAttribute(Constants.HREF_SELECTOR));
                await browser.openPage(url);
            }
        }
    }

    await browser.closeBrowser();
    return scrapedAds;
}
