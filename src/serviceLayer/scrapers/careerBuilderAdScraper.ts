import axios from 'axios';
import * as cheerio from 'cheerio';

import ScraperHelper from '../scraperHelper.js';
import Constants from "../../constants.js";
import { AdSource } from "../../dataLayer/enums/adSource.js";
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from "../../utils/utils.js";

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number, workFromHome: boolean): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.trim().replace(Constants.WHITESPACE, Constants.PLUS_SIGN);

    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    while (scrapeTracker.nOfScrapedAds < reqNofAds) {
        scrapeTracker.url = `${Constants.CAREER_BUILDER_URL}/jobs?cb_workhome=${workFromHome}&keywords=${formattedJobTitle}&page_number=${scrapeTracker.currentPage}`;
        console.log(scrapeTracker.url);
        let response = null;
        try {
            response = await axios(scrapeTracker.url);
        } catch(exception) {
            console.log(exception.message);
            throw `An exception occurred while accessing the url=${scrapeTracker.url}!`;
        }

        const $ = cheerio.load(response.data);
        const jobAdElements = $(Constants.CAREER_BUILDER_JOB_ADS).toArray().map((elem: cheerio.Element) => {
            if (elem?.attributes !== undefined) {
                let attr = elem.attributes;
                let jobLink = Constants.CAREER_BUILDER_URL + attr.find(attr => attr[Constants.CAREER_BUILDER_JOBLINK_SELECTOR[0]] == Constants.CAREER_BUILDER_JOBLINK_SELECTOR[1])[Constants.VALUE_SELECTOR].trim();

                let currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
                let newAd: JobAd = {
                    createdDate: currentTimestap,
                    updatedDate: currentTimestap,
                    source: AdSource.CAREER_BUILDER,
                    jobLink: jobLink
                };
                scrapeTracker.scrapedAds.push(newAd);
            }
        });

        if (!jobAdElements || jobAdElements.length == 0) break; 
        scrapeTracker.currentPage += 1;
        scrapeTracker.nOfScrapedAds += jobAdElements.length;
    }

    console.log(scrapeTracker.scrapedAds.length + " ads have been scraped in total.");
    return scrapeTracker.scrapedAds;
}
