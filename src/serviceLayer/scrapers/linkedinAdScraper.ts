import axios from 'axios';
import * as cheerio from 'cheerio';

import ScraperHelper from '../scraperHelper.js';
import Constants from "../../constants.js";
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number, reqJobLocation: string): Promise<JobAd[]> {
  const formattedJobTitle = reqJobTitle.trim().replace(Constants.WHITESPACE, Constants.UFT_PLUS_SIGN_ENCODING);
  const formattedCountryRequested = reqJobLocation.trim().replace(Constants.WHITESPACE, Constants.UFT_PLUS_SIGN_ENCODING);

  const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
  while (scrapeTracker.nOfScrapedAds < reqNofAds) {
    scrapeTracker.url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${formattedJobTitle}&location=${formattedCountryRequested}&locationId=&geoId=103644278&sortBy=R&f_TPR=&f_JT=F%2CP%2CC&f_E=3%2C4&start=${scrapeTracker.nOfScrapedAds}`;

    let response = null;
    try {
        response = await axios(scrapeTracker.url);
    } catch(exception) {
        console.log(exception.message);
        throw `An exception occurred while accessing the url=${scrapeTracker.url}!`;
    }

    const $ = cheerio.load(response.data);
    const jobLinks = $(Constants.LN_JOBLINKS_SELECTOR).toArray().map((elem: cheerio.Element) => {
      if (elem?.attributes !== undefined) {
        const attr = elem.attributes;
        const jobLink = attr.find(attr => attr[Constants.LN_AD_JOB_LINK_PROPS[0]] == Constants.LN_AD_JOB_LINK_PROPS[1])[Constants.VALUE_SELECTOR];

        console.log(jobLink);
        const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
        const newAd: JobAd = {
            createdDate: currentTimestap,
            updatedDate: currentTimestap,
            source: AdSource.LINKEDIN,
            jobLink: jobLink
        };
        scrapeTracker.scrapedAds.push(newAd);
      }
    });
    
    if (!jobLinks || jobLinks.length == 0) break; 
    scrapeTracker.nOfScrapedAds += jobLinks.length;
  }

  console.log(scrapeTracker.scrapedAds.length + " ads have been scraped in total.");
  return scrapeTracker.scrapedAds;
}
