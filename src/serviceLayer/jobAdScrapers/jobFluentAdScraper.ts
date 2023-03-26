import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import { AdScrapeUrlParams } from '../../dataLayer/models/adScrapeUrlParams.js';
import scrapeAdsGeneric from './common/commonAdScraper.js';

// jobTitle, publishedDate, skillsRequired
export default async function scrapeAds(reqNofAds: number): Promise<JobAd[]> {
    const urlParams: AdScrapeUrlParams = {
        reqNofAds: reqNofAds
    }

    return await scrapeAdsGeneric(urlParams, AdSource.JOB_FLUENT);
}
