import Browser from "../../browserAPI";
import Constants from "../../constants";
import { AdSource } from "../../dataLayer/enums/adSource";
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from "../../utils/utils";

export default async function scrapeAds(requestedJobTitle: string, nOfAdsToBeScraped: number): Promise<JobAd[]> {
    const formattedJobTitle = requestedJobTitle.replace(Constants.WHITESPACE, Constants.MINUS_SIGN) + Constants.CV_LIBRARY_JOBLINK_SUFFIX;
    let currentPage = 1;

    const browser = await (new Browser()).run();

    const scrapedAds: JobAd[] = [];
    let nOfScrapedAds = 0;
    let jobAdElements = null;
    let url: string | null = null;
    while (nOfScrapedAds < nOfAdsToBeScraped) {
        url = `https://www.cv-library.co.uk/${formattedJobTitle}?&page=${currentPage}`;
        await browser.openPage(url);

        jobAdElements = await browser.page.$$(Constants.CV_LIBRARY_JOBLINKS_SELECTOR);
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        let jobLink = null;
        const newAd: JobAd = {
            createdDate: null,
            updatedDate: null,
            source: null,
            jobLink: null
        };
        for (let i = 0; i < jobAdElements.length; i++) {
            jobLink = 'https://www.cv-library.co.uk/' + await jobAdElements[i].evaluate(el => el.getAttribute(Constants.HREF_SELECTOR));
            jobLink = jobLink.trim();

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            newAd.createdDate = currentTimestap;
            newAd.updatedDate = currentTimestap;
            newAd.source = AdSource.CV_LIBRARY;
            newAd.jobLink = jobLink;
            scrapedAds.push(newAd);
        }

        if (!jobAdElements || jobAdElements.length == 0) break; 
        currentPage += 1;
        nOfScrapedAds += jobAdElements.length;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browser.closeBrowser();
    return scrapedAds;
}
