import axios from 'axios';
import * as cheerio from 'cheerio';

import ScraperHelper from './common/scraperHelper.js';
import Constants from "../../constants.js";
import { AdSource } from "../../dataLayer/enums/adSource.js";
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from "../../utils/utils.js";

// postedAgo, jobTitle, companyName, officeLocation, timeEngagement
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

        const postedDates = [];
        $(Constants.CAREER_BUILDER_POSTINGDATE_SELECTOR).contents().toArray().map((elem: any) => {
            console.log(elem);
            console.log(elem.data);
            const postedDate = Utils.getPostedDate4CareerBuilder(elem.data.trim());
            postedDates.push(Utils.transformToTimestamp(postedDate.toString()));
        });
        console.log(postedDates);
        console.log(postedDates.length)

        const jobLinks = [];
        const jobAdElements = $(Constants.CAREER_BUILDER_JOB_ADS).toArray().map((elem: cheerio.Element) => {
            if (elem?.attributes !== undefined) {
                const attr = elem.attributes;
                const jobLink = Constants.CAREER_BUILDER_URL + attr.find(attr => attr[Constants.CAREER_BUILDER_JOBLINK_SELECTOR[0]] == Constants.CAREER_BUILDER_JOBLINK_SELECTOR[1])[Constants.VALUE_SELECTOR].trim();
                jobLinks.push(jobLink);
            }
        });
        console.log(jobLinks.length);
        for (let i = 0; i < jobLinks.length; i++) {
            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            const newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: AdSource.CAREER_BUILDER,
                jobLink: jobLinks[i],
                postingDate: postedDates[i]
            };

            scrapeTracker.scrapedAds.push(newAd);
        }

        if (!jobAdElements || jobAdElements.length == 0) break; 
        scrapeTracker.currentPage += 1;
        scrapeTracker.nOfScrapedAds += jobAdElements.length;
    }

    console.log(scrapeTracker.scrapedAds.length + " ads have been scraped in total.");
    return scrapeTracker.scrapedAds;
}
