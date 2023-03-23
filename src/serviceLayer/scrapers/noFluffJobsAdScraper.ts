import Browser from "../../browserAPI";
import Constants from "../../constants";
import { AdSource } from "../../dataLayer/enums/adSource";
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from "../../utils/utils";

export default async function scrapeAds(requestedJobTitle: string, nOfAdsToBeScraped: number): Promise<JobAd[]> {
    const formattedJobTitle = requestedJobTitle.trim().replace(Constants.WHITESPACE, Constants.WHITESPACE_URL_ENCODING);
    let currentPage = 1;

    const browser = await (new Browser()).run();

    const scrapedAds: JobAd[] = [];
    let nOfScrapedAds = 0;
    let jobAdElements = null;
    let url: string | null = null;
    while (nOfScrapedAds < nOfAdsToBeScraped) {
        url = `https://nofluffjobs.com/${formattedJobTitle}?page=${currentPage}`;
        await browser.page.openPage(url);

        jobAdElements = await browser.page.$$(Constants.NO_FLUFF_JOBS_JOBLINKS_SELECTOR);
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        let jobLink = null;
        const newAd: JobAd = {
            createdDate: null,
            updatedDate: null,
            source: null,
            jobLink: null
        };
        for (let i = 0; i < jobAdElements.length; i++) {
            jobLink = await jobAdElements[i].evaluate(el => el.getAttribute(Constants.HREF_SELECTOR));
            jobLink = 'https://nofluffjobs.com' + jobLink.trim();

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            newAd.createdDate = currentTimestap;
            newAd.updatedDate = currentTimestap;
            newAd.source = AdSource.NO_FLUFF_JOBS;
            newAd.jobLink = jobLink;
            scrapedAds.push(newAd);
        }

        if (!jobAdElements || jobAdElements.length == 0) break; 
        nOfScrapedAds += jobAdElements.length;
        currentPage += 1;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browser.closeBrowser();
    return scrapedAds;
}