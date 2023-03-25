import { getJobsList, release } from 'indeed-job-scraper';
import { config } from 'indeed-job-scraper';
import Constants from '../../constants.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import Utils from '../../utils/utils.js';
import adRepository from '../../dataLayer/repositories/adRepository.js';

// const adRepo = require('../dataLayer/adRepository');
// const formatter = require('../utils/formatter');
// const { getPostedDate4Indeed, transformToTimestamp } = require('../utils/utils');


config["max-pages"] = 1     //the maximum number of visited pages
config["base-URL"]  = "https://uk.indeed.com/"; //change the locality domain to restrict the search results to your country
config["verbose"]   = true;  //to deliver information about current processing

function formatAd(ad) {
    const jobLink = ad[Constants.INDEED_JOBLINK_SELECTOR];

    const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
    const newAd: JobAd = {
        createdDate: currentTimestap,
        updatedDate: currentTimestap,
        source: AdSource.INDEED,
        jobLink: jobLink
    };

    return newAd;
}

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const JOB_SEARCH_PARAMETERS = {
        query: reqJobTitle,
        duplicate: 'unique',    // unique or all
        hireType: 'directhire',
        location: 'remote',
        jobType: 'fulltime', // fulltime, parttime, contract, temporary, commission
        level      : 'senior_level', // can be entry_level mid_level senior_level
        fromdays : 33,  // # of days since a job was published
        sitetype: "employer",   // jobsite or employer
        sort     : "relevance",  // relevance or date
        maxperpage : reqNofAds,    // number of jobs per page
        // radius // of search from the given location
    }

    return getJobsList({
        query: reqJobTitle,
        ...JOB_SEARCH_PARAMETERS
        // radius // of search from the given location
    })
    .then(jobAds => {
        return jobAds.map(ad => formatAd(ad));
    }, err => {
        return Promise.reject({statusCode: 500, message: 'Error occurred while fetching job ads!'});
    })
    .then(formattedAds => {
        console.log(formattedAds.length);
        return formattedAds;
    });
}
