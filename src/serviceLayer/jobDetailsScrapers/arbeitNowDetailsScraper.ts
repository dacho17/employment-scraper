import Constants from "../../constants.js";
import { JobDetails } from "../../dataLayer/models/jobDetails.js";
import Utils from '../../utils/utils.js'

export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.ARBEITNOW_DETAILS_JOB_TITLE_SELECTOR);
    jobDetails.jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle.trim();

    const companyNameElement = await page.$(Constants.ARBEITNOW_DETAILS_COMPANY_NAME_SELECTOR);
    jobDetails.companyName = await page.evaluate(el => el.innerText, companyNameElement);
    jobDetails.companyName.trim();
    
    const companyLocationElement = await page.$(Constants.ARBEITNOW_DETAILS_COMPANY_LOCATION_SELECTOR);
    jobDetails.companyLocation = await page.evaluate(el => el.innerText, companyLocationElement);
    jobDetails.companyLocation.trim();

    // TODO: using Constants.ARBEITNOW_JOB_DETAILS_SELECTOR extract the jobDetails from this page!
    // const jobDetailsSection = await page.$('.list-none > div > div > div > div > div > div');

    const postedDateElement = await page.$(Constants.ARBEITNOW_DETAILS_POSTED_DATE_SELECTOR);
    const postedDate = await page.evaluate((el, selector) => el.getAttribute(selector), postedDateElement, Constants.DATETIME_SELECTOR);
    jobDetails.postedDate = Utils.transformToTimestamp(postedDate.trim());

    const jobDescriptionElement = await page.$(Constants.ARBEITNOW_DETAILS_JOB_DESCRIPTION_SELECTOR);
    jobDetails.jobDescription = await page.evaluate(el => el.innerText, jobDescriptionElement);
    jobDetails.jobDescription.trim();

    return jobDetails;
}
