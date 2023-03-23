import axios from 'axios';

import { AdSource } from "../../dataLayer/enums/adSource";
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from "../../utils/utils";

export default async function scrapeAds(nOfAdsToBeScraped: number): Promise<JobAd[]> {
    const scrapedAds: JobAd[] = [];

    const url = `https://api.snaphunt.com/v2/jobs?jobLocationType=remote&urlJobLocationType=remote&pageSize=${nOfAdsToBeScraped}&isFeatured=false`;

    console.log("About to send a request...")
    let jsonResponse = null;
    try {
        jsonResponse = await axios(url);
    } catch(exception) {
        console.log(exception.message);
        throw `An exception occurred while accessing the url=${url}!`;
    }

    const formattedJsonResponse = JSON.parse(JSON.stringify(jsonResponse.data));
    const jobAds = formattedJsonResponse.body.list;
    let jobLink = null;
    const newAd: JobAd = {
        createdDate: null,
        updatedDate: null,
        source: null,
        jobLink: null
    };
    jobAds.forEach(jobAd => {
        jobLink = `https://snaphunt.com/jobs/${jobAd.jobReferenceId.trim()}`;

        const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
        newAd.createdDate = currentTimestap;
        newAd.updatedDate = currentTimestap;
        newAd.source = AdSource.SNAPHUNT;
        newAd.jobLink = jobLink;
        scrapedAds.push(newAd);
    });

    console.log(scrapedAds.length + " ads have been scraped in total.");
    return scrapedAds;
}
