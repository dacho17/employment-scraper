import Browser from "../../browserAPI";
import Constants from "../../constants";
import { AdSource } from "../../dataLayer/enums/adSource";
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from "../../utils/utils";

export default async function scrapeAds(nOfAdsToBeScraped: number, requestedJobTitle: string, requestedJobLocation: string): Promise<JobAd[]> {
    const formattedJobTitle = requestedJobTitle.replace(' ', Constants.PLUS_SIGN);
    const formattedJobLocation = requestedJobLocation.replace(Constants.WHITESPACE, Constants.PLUS_SIGN);
    let currentPage = 1;

    const browser = await (new Browser()).run();

    const scrapedAds: JobAd[] = [];
    let nOfScrapedAds = 0;
    let jobAdElements = null;
    let url: string | null = null;
    while (nOfScrapedAds < nOfAdsToBeScraped) {
        url = `https://www.careerjet.com/search/jobs?s=${formattedJobTitle}&l=${formattedJobLocation}&p=${currentPage}`;
        await browser.openPage(url);

        jobAdElements = await browser.page.$$(Constants.CAREER_JET_JOBLINKS_SELECTOR);

        let jobLink: string | null = null;
        const newAd: JobAd = {
            createdDate: null,
            updatedDate: null,
            source: null,
            jobLink: null
        };
        for (let j = 0; j < jobAdElements.length; j++) {
            jobLink = await jobAdElements[j].evaluate(el => el.getAttribute(Constants.HREF_SELECTOR));
            jobLink = 'https://www.careerjet.com' + jobLink.trim();

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            newAd.createdDate = currentTimestap;
            newAd.updatedDate = currentTimestap;
            newAd.source = AdSource.CAREER_JET;
            newAd.jobLink = jobLink;
            scrapedAds.push(newAd);
        }

        if (!jobAdElements || jobAdElements.length == 0) break; 
        currentPage += 1;
        nOfScrapedAds += jobAdElements.length;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");
    return scrapedAds;
}
