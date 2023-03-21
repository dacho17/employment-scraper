const axios = require('axios');

const adRepository = require('../dataLayer/adRepository');
const constants = require('../constants');
const { transformToTimestamp } = require('../utils/utils');

async function scrapeAds(nOfAdsToBeScraped) {
    let scrapedAds = [];
    let URL = `https://api.snaphunt.com/v2/jobs?jobLocationType=remote&urlJobLocationType=remote&pageSize=${nOfAdsToBeScraped}&isFeatured=false`;

    console.log("About to send a request...")
    let jsonResponse = null;
        try {
            jsonResponse = await axios(URL);
        } catch(exception) {
            console.log(exception.message);
            throw `An exception occurred while accessing the url=${URL}!`;
        }

        let formattedJsonResponse = JSON.parse(JSON.stringify(jsonResponse.data));
        let jobAds = formattedJsonResponse.body.list;
        jobAds.forEach(jobAd => {
            let jobReferenceId = jobAd.jobReferenceId;
            let jobLink = `https://snaphunt.com/jobs/${jobReferenceId}`
            let jobTitle = jobAd.jobTitle;
            let companyName = null; // employers are not disclosed on the webpage
            let companyLocation = jobAd.location.join(" ");
            let jobEngagement = jobAd.jobEngagement;
            let jobDescriptionHtml = jobAd.jobListing.roleDescription;
            let jobDescription = jobDescriptionHtml.replace(/<[^>]+>/g, '');
            let salaryInfo = constants.UNDISCLOSED_SALARY;
            if (jobAd.showSalary == true) {
                salaryInfo = `${jobAd.minSalary}-${jobAd.maxSalary} ${jobAd.currency}`
            }
            let dateListed = jobAd.jobListing.updatedAt; // operating under assumption the 'earlier' updated date is a listed date
            dateListed = transformToTimestamp(dateListed);

            let workLocation = jobAd.jobLocationType;

            scrapedAds.push({
                source: 'SNAPHUNT',
                jobLink: jobLink,
                jobTitle: jobTitle,
                companyName: companyName,
                companyLocation: companyLocation,
                workLocation: workLocation,
                jobEngagement: jobEngagement,
                jobDescription: jobDescription,
                salaryInfo: salaryInfo,
                postedDate: dateListed
            });
        });

        return scrapedAds;
}

async function doAscrape(nOfAdsRequested) {
    let scrapedAds = null
    try {
       scrapedAds = await scrapeAds(nOfAdsRequested);
    } catch (exception) {
      console.log(exception.message);
      return {
          statusCode: 500,
          message: exception.message
      }
    }

    try {
        adRepository.storeAdsToDB(scrapedAds);
        adRepository.storeAdDetails(scrapedAds);
        return {
            statusCode: 200,
            message: 'Ads scraped and stored into the database successfully!'
        }
      } catch (exception) {
        return {
            statusCode: 500,
            message: exception.message
        }
    }
}

module.exports = {
    doAscrape: doAscrape
}
