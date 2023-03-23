import axios from 'axios';
import * as cheerio from 'cheerio';

import Constants from "../../constants";
import { AdSource } from '../../dataLayer/enums/adSource';
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from '../../utils/utils';

export default async function scrapeAds(jobTitleRequested: string, jobCountryRequested: string, nOfAdsRequested: number): Promise<JobAd[]> {
  const formattedJobTitle = jobTitleRequested.trim().replace(Constants.WHITESPACE, Constants.UFT_PLUS_SIGN_ENCODING);
  const formattedCountryRequested = jobCountryRequested.trim().replace(Constants.WHITESPACE, Constants.UFT_PLUS_SIGN_ENCODING);

  const scrapedAds: JobAd[] = [];
  let nOfScrapedAds = 0;
  let jobLinks = null;
  let url: string | null = null;
  while (nOfScrapedAds < nOfAdsRequested) {
    url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${formattedJobTitle}&location=${formattedCountryRequested}&locationId=&geoId=103644278&sortBy=R&f_TPR=&f_JT=F%2CP%2CC&f_E=3%2C4&start=${nOfScrapedAds}`;
    console.log("About to send a request...")

    console.log(url);
    let response = null;
    try {
        response = await axios(url);
    } catch(exception) {
        console.log(exception.message);
        throw `An exception occurred while accessing the url=${url}!`;
    }

    const $ = cheerio.load(response.data);

    jobLinks = $(Constants.LN_AD_JOB_LINK_SELECTOR);
    let jobLink = null;
    const newAd: JobAd = {
      createdDate: null,
      updatedDate: null,
      source: null,
      jobLink: null
    };
    console.log('fetched ' + jobLinks.length + ' ads from linkedin');
    for (let i = 0; i < jobLinks.length; i++) {
      jobLink = jobLinks[i]?.attributes.find(attr => attr[Constants.LN_AD_JOB_LINK_PROPS[0]] == Constants.LN_AD_JOB_LINK_PROPS[1])[Constants.VALUE_SELECTOR];

      const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());

      newAd.createdDate = currentTimestap;
      newAd.updatedDate = currentTimestap;
      newAd.source = AdSource.LINKEDIN;
      newAd.jobLink = jobLink;
      scrapedAds.push(newAd);
    }
    
    if (!jobLinks || jobLinks.length == 0) break; 
    nOfScrapedAds += jobLinks.length;
  }

  console.log(scrapedAds.length + " ads have been scraped in total.");
  console.log(scrapedAds[0].createdDate);
  return scrapedAds;
}
