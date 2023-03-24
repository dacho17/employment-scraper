import axios from 'axios';

import ScraperHelper from '../scraperHelper.js';
import { AdSource } from "../../dataLayer/enums/adSource.js";
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from "../../utils/utils.js";

export default async function scrapeAds(reqNofAds: number): Promise<JobAd[]> {
    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    scrapeTracker.url = `https://api.snaphunt.com/v2/jobs?jobLocationType=remote&urlJobLocationType=remote&pageSize=${reqNofAds}&isFeatured=false`;
    let jsonResponse = null;
    try {
        jsonResponse = await axios(scrapeTracker.url);
    } catch(exception) {
        console.log(exception.message);
        throw `An exception occurred while accessing the url=${scrapeTracker.url}!`;
    }

    const formattedJsonResponse = JSON.parse(JSON.stringify(jsonResponse.data));
    const jobAds = formattedJsonResponse.body.list;
    jobAds.forEach(jobAd => {
        const jobLink = `https://snaphunt.com/jobs/${jobAd.jobReferenceId.trim()}`;

        const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
        const newAd: JobAd = {
            createdDate: currentTimestap,
            updatedDate: currentTimestap,
            source: AdSource.SNAPHUNT,
            jobLink: jobLink
        };
        scrapeTracker.scrapedAds.push(newAd);
    });

    console.log(scrapeTracker.scrapedAds.length + " ads have been scraped in total.");
    console.log(scrapeTracker.scrapedAds[0]);
    return scrapeTracker.scrapedAds;
}
