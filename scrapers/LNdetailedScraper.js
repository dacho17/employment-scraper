const { connectToDB, closeDB } = require('../database/db');
const browserAPI = require('../browserAPI');
const utils = require('../utils/utils');
const formatter = require('../utils/formatter');
const constants = require('../constants');

async function getData(page) {
    let location = await browserAPI.getDataFrom(page, constants.LN_DETAIL_LOCATION_SELECTOR);
    const locationFormatted = formatter.formatEntry(location);

    let jobTitle = await browserAPI.getDataFrom(page, constants.LN_DETAIL_JOBTITLE_SELECTOR);
    const jobTitleFormatted = formatter.formatEntry(jobTitle);

    let company = await browserAPI.getDataFrom(page, constants.LN_DETAIL_COMPANY_SELECTOR);
    const companyFormatted = formatter.formatEntry(company);
    
    let postedAgo = await browserAPI.getDataFrom(page, constants.LN_DETAIL_POSTEDAGO_SELECTOR);
    const dateOfPosting = utils.getPostedDate4LinkedIn(postedAgo);

    let nOfApplicants = await browserAPI.getDataFrom(page, constants.LN_DETAIL_NOFAPPLICANTS_SELECTOR);
    const nOfApplicantsFormatted = utils.getNumberOfApplicants(nOfApplicants);
    
    let adContent = await browserAPI.getDataFrom(page, constants.LN_DETAIL_ADCONTENT_SELECTOR);
    const adContentFormatted = formatter.formatEntry(adContent);
    
    let jobPropsElement = await page.$$(constants.LN_DETAIL_JOBPROPS_SELECTOR);
    const jobPropsFormatted = await formatter.formatJobProps(jobPropsElement);

    console.log(locationFormatted, jobTitleFormatted, companyFormatted, dateOfPosting, nOfApplicantsFormatted, adContentFormatted, jobPropsFormatted);
    return {
        location: locationFormatted,
        jobTitle: jobTitleFormatted,
        company: companyFormatted,
        postingDate: utils.transformToTimestamp(dateOfPosting),
        nOfApplicants: nOfApplicantsFormatted,
        adContent: adContentFormatted,
        jobProps: jobPropsFormatted
    }
}

async function scrapePage(browser, url) {
    const page = await browserAPI.openPage(browser, url);
    
    const data = await getData(page);
    return data;
}

async function storeAdDetailsToDB(db, data) {
    const createdDate = utils.transformToTimestamp(new Date(Date.now()));

    try {
        db.run(`INSERT INTO ad_details (created_at, updated_at, posting_date,n_of_applicants,ad_content,job_props)
            VALUES ("${createdDate}","${createdDate}","${data.postingDate}","${data.nOfApplicants}","${data.adContent}","${data.jobProps}");`
        );
     } catch (exception) {
        console.log(exception);
    }
}

async function scrapeAdsDetails() {
    const db = connectToDB();
    const browser = await browserAPI.runBrowser();

    // TODO: get unfetched detailed LINKEDIN entries, and scrape the adDetails for those
    let url = 'https://www.linkedin.com/jobs/view/python-developer-at-unisys-3525982488?refId=m%2F4l3DuegsmePPSRzcBJpQ%3D%3D&trackingId=CoRhnBvBBJ1931me6kmUeg%3D%3D&position=5&pageNum=0&trk=public_jobs_jserp-result_search-card';
    
    let data = null;
    try {
        data = await scrapePage(browser, url);
    } catch(exception) {
        console.log(exception.message);
        return {
            statusCode: 500,
            message: `An exception occurred while accessing the url=${url}!`
        }
    }

    try {
        await storeAdDetailsToDB(db, data);
    } catch (exception) {
        console.log(exception.message);
        return {
            statusCode: 500,
            message: 'An exception occurred while inserting scraped ads into the DB!'
        }
    }
    
    await browserAPI.closeBrowser(browser);
    closeDB(db);

    return {
        statusCode: 200,
        message: 'Ads scraped and stored into the database successfully!'
    }
}

module.exports = {
    scrapeAdsDetails: scrapeAdsDetails
}
