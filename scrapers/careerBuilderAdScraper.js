const axios = require('axios');
const cheerio = require('cheerio');

const adRepository = require('../dataLayer/adRepository');
const utils = require('../utils/utils');

const N_OF_ADS_PER_PAGE = 25;

function formatEntry(entry) {
    let formattedEntry = '';
    entry.trim().split(' ').forEach(part => {
        formattedEntry += part.trim() + '+';
    });

    return formattedEntry.slice(0, -1);
}

function extractJobDetails(jobDetails) {
    if (jobDetails.length == 2) {
        return [null, jobDetails[0], jobDetails[1]]
    } else if (jobDetails.length == 3) {
        return jobDetails;
    }

    return [null, null, null];
}

async function scrapeAds(workFromHome, jobTitleRequested, nOfAdsRequested) {
    let formattedJobTitle = formatEntry(jobTitleRequested);

    let currentPage = 0;
    let scrapedAds = [];
    while (scrapedAds.length < nOfAdsRequested) {
        let URL = `https://www.careerbuilder.com/jobs?cb_workhome=${workFromHome}&keywords=${formattedJobTitle}&page_number=${currentPage}`;

        console.log("About to send a request...")

        let response = null;
        try {
            response = await axios(URL);
        } catch(exception) {
            console.log(exception.message);
            throw exception(`An exception occurred while accessing the url=${URL}!`);
        }

        let html = response.data;
        let $ = cheerio.load(html);

        // extract data
        let jobs = $('li');
        if (jobs.length == 0) break;

        let publishedDates = jobs.find('.data-results-publish-time');    // x days ago || Today
        let jobDetailsList = jobs.find('.data-details');
        // jobDetailsList = jobDetailsList.slice(4);   // first 4 elements are empty
        let jobListings = jobs.find('.job-listing-item');

        console.log(publishedDates.length);
        console.log(jobDetailsList.length);
        console.log(jobListings.length);
        // format data 

        for (let i = 0; i < jobListings.length; i++) {
            let publishedAgo = publishedDates[i]?.children.pop().data.trim();
            let publishedDate = utils.getPostedDate4CareerBuilder(publishedAgo);
            let publishedTimeStamp = utils.transformToTimestamp(publishedDate);

            let jobDetailsContainer = jobDetailsList[i].children.filter(node => node.name == 'span');
            let jobDetails = [];
            jobDetailsContainer.forEach(member => {
                jobDetails.push(member.children.pop().data);
            });
            let [companyName, companyLocation, hireType] = extractJobDetails(jobDetails);

            let jobLink = 'https://www.careerbuilder.com' + jobListings[i]?.attributes.find(attr => attr['name'] == 'href')['value'].trim();
            let jobTitle = jobListings[i]?.attributes.find(attr => attr['name'] == 'title')['value'].trim();

            scrapedAds.push({
                source: 'CAREER_BUILDER',
                jobLink: jobLink,
                jobTitle: jobTitle,
                companyName: companyName,
                hireType: hireType,
                jobDescription: null,
                companyLocation: companyLocation,
                salaryInfo: null,
                postedDate: publishedTimeStamp
              });
        }

        currentPage += 1;
    }

    console.log(scrapedAds);
    console.log(scrapedAds.length + " ads have been scraped in total.");
    
    return scrapedAds;
}

async function doAscrape(workFromHome, jobTitleRequested, nOfAdsRequested) {
    let scrapedAds = null
    try {
       scrapedAds = await scrapeAds(workFromHome, jobTitleRequested, nOfAdsRequested);
    } catch (exception) {
      console.log(exception.message);
      return {
          statusCode: 500,
          message: exception.message
      }
    }

    try {
        adRepository.storeAdsToDB(scrapedAds);
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
