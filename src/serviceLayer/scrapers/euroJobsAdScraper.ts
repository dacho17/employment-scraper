import Constants from '../../constants';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { AdScrapeUrlParams } from "../../dataLayer/models/adScrapeUrlParams";
import { JobAd } from '../../dataLayer/models/jobAd.js';
import scrapeAdsGeneric from "./common/commonAdScraper";

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.trim().replace(Constants.WHITESPACE, Constants.PLUS_SIGN);
    const urlParams: AdScrapeUrlParams = {
        jobTitle: formattedJobTitle,
        reqNofAds: reqNofAds
    }

    return await scrapeAdsGeneric(urlParams, AdSource.EURO_JOBS);
}
