const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const adRepo = require('../dataLayer/adRepository');
const { transformToTimestamp } = require('../utils/utils');
const formatter = require('../utils/formatter');
const constants = require('../constants');

async function scrapeAds(jobTitleRequested, jobCountryRequested, nOfAdsRequested) {
  let AD_OFFSET = 0;
  let scrapedAds = [];
  let currentJobBatch = 25;
  while (AD_OFFSET < nOfAdsRequested) {
    if (currentJobBatch == 0) {
      break;
    }

    let URL = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${formatter.formatQueryWord(jobTitleRequested, ' ', '%2B')}&location=${formatter.formatQueryWord(jobCountryRequested, ' ', '%2B')}&locationId=&geoId=103644278&sortBy=R&f_TPR=&f_JT=F%2CP%2CC&f_E=3%2C4&start=${AD_OFFSET}`;
    console.log("About to send a request...")

    let response = null;
    try {
        response = await axios(URL);
    } catch(exception) {
        console.log(exception.message);
        throw `An exception occurred while accessing the url=${URL}!`;
    }

    console.log("Scraped " + AD_OFFSET + " ads so far.\n");

    let html = response.data;
    let $ = cheerio.load(html);

    let jobs = $(constants.LN_AD_JOB_AD_SELECTOR);

    currentJobBatch = jobs.length;

    let jobLinks = jobs.find(constants.LN_AD_JOB_LINK_SELECTOR);
    let jobTitles = jobs.find(constants.LN_AD_JOB_TITLE_SELECTOR);
    let companyNames = jobs.find(constants.LN_AD_COMPANY_NAME_SELECTOR).find('a');
    let locations = jobs.find(constants.LN_AD_LOCATION_SELECTOR);
    let salaryInfos = jobs.find(constants.LN_AD_SALARYINFO_SELECTOR);
    let listedDates = jobs.find(constants.LN_AD_LISTEDDATES_SELECTOR);

    for (let i = 0; i < currentJobBatch; i++) {
      let jobLink = jobLinks[i]?.attributes.find(attr => attr[constants.LN_AD_JOB_LINK_PROPS[0]] == constants.LN_AD_JOB_LINK_PROPS[1])['value'];

      let jobTitle = jobTitles[i]?.children.pop().data.trim();
      let formattedJobTitle = formatter.formatEntry(jobTitle);

      let companyName = companyNames[i]?.children.pop().data.trim();
      let formattedCompanyName = formatter.formatEntry(companyName);

      let location = locations[i]?.children.pop().data.trim();
      let formattedLocation = formatter.formatEntry(location);

      let salaryInfo = salaryInfos[i]?.children.pop().data;
      formattedSalaryInfo = formatter.formatEntry(salaryInfo);
      if (!formattedSalaryInfo) formattedSalaryInfo = constants.UNDISCLOSED_SALARY;

      let listedDate = listedDates[i]?.attributes.find(attr => attr[constants.LN_AD_LISTEDDATES_PROPS[0]] == constants.LN_AD_LISTEDDATES_PROPS[1])['value'].trim();
      listedDate = transformToTimestamp(listedDate);

      scrapedAds.push({
        source: constants.LINKEDIN,
        jobLink: jobLink,
        jobTitle: formattedJobTitle,
        companyName: formattedCompanyName,
        companyLocation: formattedLocation,
        workLocation: null, // TODO: check if this data is avaliable!
        jobEngagement: null,
        jobDescription: null,
        salaryInfo: formattedSalaryInfo,
        postedDate: listedDate
      });
    }

    AD_OFFSET += currentJobBatch;
  }
  console.log(scrapedAds.length + " ads have been scraped in total.");

  // writeIntoCSVfile(scrapedAds);  NOTE: let us save the ads to the database

  return scrapedAds;
}

module.exports = {
    scrapeAds: scrapeAds
}
