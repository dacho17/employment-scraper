import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import { AdScrapeUrlParams } from '../../dataLayer/models/adScrapeUrlParams.js';
import scrapeAdsGeneric from './common/commonAdScraper.js';

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.trim().replace(Constants.WHITESPACE, Constants.PLUS_SIGN);
    const urlParams: AdScrapeUrlParams = {
        jobTitle: formattedJobTitle,
        reqNofAds: reqNofAds
    }

    return await scrapeAdsGeneric(urlParams, AdSource.ARBEIT_NOW);
}
