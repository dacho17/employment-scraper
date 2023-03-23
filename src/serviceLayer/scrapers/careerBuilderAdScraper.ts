import axios from 'axios';
import * as cheerio from 'cheerio';

import Constants from "../../constants";
import { AdSource } from "../../dataLayer/enums/adSource";
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from "../../utils/utils";

export default async function scrapeAds(workFromHome: boolean, requestedJobTitle: string, nOfAdsToBeScraped: number): Promise<JobAd[]> {
    const formattedJobTitle = requestedJobTitle.trim().replace(Constants.WHITESPACE, Constants.PLUS_SIGN);
    let currentPage = 1;

    const scrapedAds: JobAd[] = [];
    let nOfScrapedAds = 0;
    let jobAdElements = null;
    let url: string | null = null;
    while (nOfScrapedAds < nOfAdsToBeScraped) {
        url = `https://www.careerbuilder.com/jobs?cb_workhome=${workFromHome}&keywords=${formattedJobTitle}&page_number=${currentPage}`;
        let response = null;
        try {
            response = await axios(url);
        } catch(exception) {
            console.log(exception.message);
            throw `An exception occurred while accessing the url=${url}!`;
        }

        const $ = cheerio.load(response.data);
        jobAdElements = $(Constants.CAREER_BUILDER_JOB_ADS);

        let jobLink: string | null = null;
        const newAd: JobAd = {
            createdDate: null,
            updatedDate: null,
            source: null,
            jobLink: null
        };
        for (let i = 0; i < jobAdElements.length; i++) {
            jobLink = 'https://www.careerbuilder.com' + jobAdElements[i]?.attributes.find(attr => attr[Constants.CAREER_BUILDER_JOBLINK_SELECTOR[0]] == Constants.CAREER_BUILDER_JOBLINK_SELECTOR[1])['value'].trim();

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            newAd.createdDate = currentTimestap;
            newAd.updatedDate = currentTimestap;
            newAd.source = AdSource.CAREER_BUILDER;
            newAd.jobLink = jobLink;
            scrapedAds.push(newAd);
        }

        if (!jobAdElements || jobAdElements.length == 0) break; 
        currentPage += 1;
        nOfScrapedAds += jobAdElements.length;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");
    return scrapedAds;
}
