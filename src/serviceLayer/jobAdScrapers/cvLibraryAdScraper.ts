import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import { AdScrapeUrlParams } from '../../dataLayer/models/adScrapeUrlParams.js';
import scrapeAdsGeneric from './common/commonAdScraper.js';

// jobTitle, postedDate, salary, companyLocation, timeEngagement
export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.replace(Constants.WHITESPACE, Constants.MINUS_SIGN) + Constants.CV_LIBRARY_JOBLINK_SUFFIX;
    const urlParams: AdScrapeUrlParams = {
        jobTitle: formattedJobTitle,
        reqNofAds: reqNofAds
    }

    return await scrapeAdsGeneric(urlParams, AdSource.CV_LIBRARY);
}
