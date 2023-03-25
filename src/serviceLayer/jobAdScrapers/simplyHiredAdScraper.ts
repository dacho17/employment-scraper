import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import { AdScrapeUrlParams } from '../../dataLayer/models/adScrapeUrlParams.js';
import scrapeAdsGeneric from './common/commonAdScraper.js';

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number, reqJobLocation: string): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.replace(Constants.WHITESPACE, Constants.PLUS_SIGN);
    const formattedJobLocation = reqJobLocation.replace(Constants.WHITESPACE, Constants.PLUS_SIGN).replace(Constants.COMMA, Constants.ASCII_COMMA_SIGN_ENCODING);
    const urlParams: AdScrapeUrlParams = {
        jobTitle: formattedJobTitle,
        reqNofAds: reqNofAds,
        location: formattedJobLocation
    }

    return await scrapeAdsGeneric(urlParams, AdSource.SIMPLY_HIRED);
}
