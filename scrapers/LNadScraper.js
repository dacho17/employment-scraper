const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs');
const { connectToDB, closeDB } = require('../database/db');
const { transformToTimestamp } = require('../utils/utils');
const formatter = require('../utils/formatter');
const constants = require('../constants');

// let ADS_TO_SCRAPE = 10; // INPUT: set this to a desired value
// let POSITION = 'Python Developer';
// let COUNTRY = 'United States';

async function scrapeAds(jobTitleRequested, jobCountryRequested, nOfAdsRequested) {
  let AD_OFFSET = 0;
  let scrapedAds = [];
  let currentJobBatch = 25;
  console.log("Starting to scrape!\n")
  while (AD_OFFSET < nOfAdsRequested) {
    if (currentJobBatch == 0) {
      break;
    }

    let URL = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${formatter.formatQueryWord(jobTitleRequested, '%2B')}&location=${formatter.formatQueryWord(jobCountryRequested, '%2B')}&locationId=&geoId=103644278&sortBy=R&f_TPR=&f_JT=F%2CP%2CC&f_E=3%2C4&start=${AD_OFFSET}`;
    console.log("About to send a request...")

    let response = null;
    try {
        response = await axios(URL);
    } catch(exception) {
        console.log(exception.message);
        throw exception(`An exception occurred while accessing the url=${URL}!`);
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
        jobLink: jobLink,
        jobTitle: formattedJobTitle,
        companyName: formattedCompanyName,
        location: formattedLocation,
        salaryInfo: formattedSalaryInfo,
        listedDate: listedDate
      });
    }

    AD_OFFSET += currentJobBatch;
  }
  console.log(scrapedAds.length + " ads have been scraped in total.");

  // writeIntoCSVfile(scrapedAds);  NOTE: let us save the ads to the database

  return scrapedAds;
}

function writeIntoCSVfile(scrapedAds) {
    let outputFileName = `./jobAds-${formatter.formatQueryWord(jobTitleRequested, '')}_${formatter.formatQueryWord(jobCountryRequested, '')}.csv`;
    let headline = 'Job Link,Job Title,Company Name,Location,Salary,Listed Date\n';
    fs.appendFileSync(outputFileName, headline);

    scrapedAds.forEach(ad => {
      let adLine = `${ad.jobLink},${ad.jobTitle},${ad.companyName},${ad.location},${ad.salaryInfo},${ad.listedDate}\n`
      fs.appendFileSync(outputFileName, adLine);
    });
}

function storeAdsToDB(scrapedAds) {
    const db = connectToDB();
    
    const createdDate = transformToTimestamp(new Date(Date.now()));

    let queryValues = 'VALUES ';
    scrapedAds.forEach(ad => {  
        queryValues += '(' + `"${createdDate}","${createdDate}","${constants.LINKEDIN}","${ad.jobLink}","${ad.jobTitle}","${ad.companyName}","${ad.location}","${ad.salaryInfo}","${ad.listedDate}"),`;
    });
    queryValues = queryValues.slice(0, -1);

    console.log("about to query the database")
    try {
        db.run(`INSERT INTO job_ads (created_at,updated_at,source,job_link,job_title,company_name,location,salary_info,posting_date)
            ${queryValues};`
        );
    } catch (exception) {
        console.log(exception);
        throw exception('An exception occurred while inserting scraped ads into the DB!');
    } finally {
        closeDB(db);
    }
}
async function doAscrape(jobTitleRequested, jobCountryRequested, nOfAdsRequested) {
    let scrapedAds = null
    try {
       scrapedAds = await scrapeAds(jobTitleRequested, jobCountryRequested, nOfAdsRequested);
    } catch (exception) {
      console.log('line 125.' + exception.message)
      return {
          statusCode: 500,
          message: exception.message
      }
    }

    try {
        storeAdsToDB(scrapedAds);
        return {
            statusCode: 200,
            message: 'Ads scraped and stored into the database successfully!'
        }
      } catch (exception) {
        console.log('line 139.' + exception.message)
        return {
            statusCode: 500,
            message: exception.message
        }
    }
}

module.exports = {
  doAscrape: doAscrape
}
