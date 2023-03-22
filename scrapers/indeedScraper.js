let { getJobsList, release } = require('../node_modules/indeed-job-scraper/index');
let { config } = require("indeed-job-scraper");

const adRepo = require('../dataLayer/adRepository');
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
        source: constants.INDEED,
        jobLink: jobLink,
        jobTitle: jobTitle,
        companyName: companyName,
        jobEngagement: null,
        companyLocation: companyLocation,
        workLocation: workLocation, // TODO: check if this data is avaliable!
        jobDescription: jobDescription,
        salaryInfo: salary,
        postedDate: postedDate
    }
}

async function doAscrape(jobTitle) {
    return getJobsList({
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
        let responseObject = {
            statusCode: 200,
            message: 'Ads scraped and stored into the database successfully!'
        }

        try {
            adRepo.storeAdsToDB(formattedAds);
            adRepo.storeAdDetails(formattedAds);
        } catch (exception) {
            console.log('line 139.' + exception.message)
            responseObject = {
                statusCode: 500,
                message: exception.message
            }
        } finally {
            release;
        }
        
        return Promise.resolve(responseObject);
    });
}

module.exports = {
    doAscrape: doAscrape
}

/*  IF I WANT TO MAKE MY OWN INDEED SCRAPER THIS IS THE WAY:
let jobTitle = formatQueryWord(requestedJobTitle, ' ', '%20');
let jobLocation = formatQueryWord(requestedJobLocation, ' ', '%20');
jobLocation = formatQueryWord(jobLocation, ',', '%2C');

let URL = `https://www.indeed.com/jobs?q=${jobTitle}&l=${jobLocation}&start=${currentStart}`;

jobSelector -> '.jobsearch-ResultsList > li'
jobLink -> '.jobTitle > a[href]'
jobTitle -> 'span > .title'
companyName -> '.companyOverviewLink'
companyLink -> '.companyOverviewLink [href]'
companyLocation -> '.companyLocation' + '.companyLocation--extras'
salaryInfo -> '.salary-snippet-container > .attribute_snippet text'
jobProps -> '.salaryOnly > metadata > attribute_snippet text'
postedDate -> '.result-footer > .date'
*/