let fs = require('fs');
let path = require('path');
const datefns = require("date-fns");
let { getJobsList, release } = require('../node_modules/indeed-job-scraper/index');
let { config } = require("indeed-job-scraper");

const { connectToDB, closeDB } = require('../database/db');
const formatter = require('../utils/formatter');
const { getPostedDate4Indeed, transformToTimestamp } = require('../utils/utils');
const constants = require('../constants');

config["max-pages"] = 2     //the maximum number of visited pages
// config["base-URL"]  = "https://uk.indeed.com/"; //change the locality domain to restrict the search results to your country
// config["verbose"]   = true;  //to deliver information about current processing

// TODO: make this dynamic!
const JOB_SEARCH_PARAMETERS = {
    duplicate: 'unique',    // unique or all
    hireType: 'directhire',
    location: 'remote',
    jobType: 'fulltime', // fulltime, parttime, contract, temporary, commission
    level      : 'senior_level', // can be entry_level mid_level senior_level
	fromdays : 33,  // # of days since a job was published
	sitetype: "employer",   // jobsite or employer
	sort     : "relevance",  // relevance or date
	maxperpage : 20,    // number of jobs per page
	// radius // of search from the given location
}

// not relevant for now
// function writeIntoCSVfile(scrapedAds) {
//     let outputFileName = `./jobAds-${formatEntry(JOB_TITLE.query, ' ', '_')}.csv`;
//     let headline = 'Job Link,Job Title,Company Name,Location,Job Description,Salary,Listed Date\n';
//     fs.appendFileSync(outputFileName, headline);

//     scrapedAds.forEach(ad => {
//       let adLine = `${ad.jobLink},${ad.jobTitle},${ad.companyName},${ad.companyLocation},${ad.jobDescription},${ad.salary},${ad.postedDate}\n`
//       fs.appendFileSync(outputFileName, adLine);
//     });
// }

function formatAd(ad) {
    let jobLink = ad[constants.INDEED_JOBLINK_SELECTOR];
    let jobTitle = formatter.formatEntry(ad[constants.INDEED_JOBTITLE_SELECTOR]);
    let companyName = formatter.formatEntry(ad[constants.INDEED_COMPANYNAME_SELECTOR]);
    let companyLocation = formatter.formatEntry(ad[constants.INDEED_LOCATION_SELECTOR]);
    let jobDescription = formatter.formatEntry(ad[constants.INDEED_JOBDESCRIPTION_SELECTOR]);
    
    let salary = formatter.formatEntry(ad[constants.INDEED_JOBSALARY_SELECTOR]);
    if (!salary) salary = constants.UNDISCLOSED_SALARY;
    
    let postedDate = getPostedDate4Indeed(ad[constants.INDEED_POSTDATE_SELECTOR]);
    postedDate = transformToTimestamp(postedDate);

    return {
        jobLink: jobLink,
        jobTitle: jobTitle,
        companyName: companyName,
        companyLocation: companyLocation,
        jobDescription: jobDescription,
        salary: salary,
        postedDate: postedDate
    }
}

async function doAscrape(jobTitle) {
    getJobsList({
        query: jobTitle,
        ...JOB_SEARCH_PARAMETERS
        // radius // of search from the given location
    })
    .then(jobAds => {
        let scrapedAds = jobAds.map(ad => formatAd(ad));
        return scrapedAds;
    }, err => {
        return Promise.reject({statusCode: 500, message: 'Error occurred while fetching job ads!'});
    })
    .then(formattedAds => {
        const db = connectToDB();
        
        const createdDate = transformToTimestamp(new Date(Date.now()));
    
        let adsQueryValues = 'VALUES ';
        let detailsQueryValues = 'VALUES ';
        formattedAds.forEach(ad => {  
            adsQueryValues += '(' + `"${createdDate}","${createdDate}","${constants.INDEED}","${ad.jobLink}","${ad.jobTitle}","${ad.companyName}","${ad.companyLocation}","${ad.salary}","${ad.postedDate}","TRUE","${createdDate}"),`;
            detailsQueryValues += '(' + `"${createdDate}","${createdDate}","${ad.postedDate}","${ad.jobDescription}"),`
        });
        adsQueryValues = adsQueryValues.slice(0, -1);
        detailsQueryValues = detailsQueryValues.slice(0, -1);
    
        let response = {
            statusCode: 200,
            message: 'Successfully stored job ads to the database',
        };

        try {
            db.run(`INSERT INTO ad_details (created_at,updated_at,posting_date,ad_content)
                ${detailsQueryValues};`
            );
            db.run(`INSERT INTO job_ads (created_at,updated_at,source,job_link,job_title,company_name,location,salary_info,posting_date,are_details_scraped,details_scraped_date)
                ${adsQueryValues};`
            );
         } catch (exception) {
            console.log(exception);
            response.statusCode = 500;
            response.message = 'An error occurred while attempting to store job ads to the database';
        } finally {
            closeDB(db);
            release;
            return response;
        } 
    });
}

module.exports = {
    doAscrape: doAscrape
}
