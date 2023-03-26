import scrapeAdsGeneric from './common/commonAdScraper.js';
import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { AdScrapeUrlParams } from '../../dataLayer/models/adScrapeUrlParams.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';

// jobTitle, companyName, timeEngagement, location
export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.trim().replace(Constants.WHITESPACE, Constants.WHITESPACE_URL_ENCODING);
    const urlParams: AdScrapeUrlParams = {
        jobTitle: formattedJobTitle,
        reqNofAds: reqNofAds
    }

    return await scrapeAdsGeneric(urlParams, AdSource.GRADUATELAND);
}
