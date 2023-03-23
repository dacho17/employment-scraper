import Browser from "../../browserAPI";
import Constants from "../../constants";
import { AdSource } from "../../dataLayer/enums/adSource";
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from "../../utils/utils";

export default async function scrapeAds(requestedJobTitle: string, nOfAdsToBeScraped: number): Promise<JobAd[]> {
    const formattedJobTitle = requestedJobTitle.replace(Constants.WHITESPACE, Constants.WHITESPACE_URL_ENCODING);

    const browser = await (new Browser()).run();

    let url = null;
    let nOfScrapedAds = 0;
    let jobLinkElements = null;
    const scrapedAds: JobAd[] = [];
    while (nOfScrapedAds < nOfAdsToBeScraped) {
        url = `${Constants.TYBA_URL}/jobs?keyword=${formattedJobTitle}r&limit=10&offset=${nOfScrapedAds}`;
        await browser.openPage(url);

        jobLinkElements = await browser.page.$$(Constants.TYBA_JOBLINKS_SELECTOR);
        console.log("about to scrape " + url + ". " + jobLinkElements.length + " job ads have been detected on the page");
        let jobLink = null;
        const newAd: JobAd = {
            createdDate: null,
            updatedDate: null,
            source: null,
            jobLink: null
        };
        for (let j = 0; j < jobLinkElements.length; j++) {
            jobLink = await jobLinkElements[j].evaluate(el => el.getAttribute(Constants.HREF_SELECTOR));
            jobLink = Constants.TYBA_URL + jobLink.trim();

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            newAd.createdDate = currentTimestap;
            newAd.updatedDate = currentTimestap;
            newAd.source = AdSource.TYBA;
            newAd.jobLink = jobLink;
            scrapedAds.push(newAd);
        }
        
        if (!jobLinkElements || jobLinkElements.length == 0) break;
        nOfScrapedAds += jobLinkElements.length;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browser.closeBrowser();
    return scrapedAds;
}
