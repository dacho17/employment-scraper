import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";

// EUworkPermitRequired, jobViews, applicationDeadline
// jobTitle, companyLocation, companyName, postedDate, jobDescription
export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.EURO_JOBS_DETAILS_JOB_TITLE_SELECTOR);
    jobDetails.jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle.trim();

    let details = '';
    const jobDetailsKeysElement = await page.$$(Constants.EURO_JOBS_DETAILS_JOB_DETAILS_KEY_SELECTOR);
    const jobDetailsValuesElement = await page.$$(Constants.EURO_JOBS_DETAILS_JOB_DETAILS_VALUE_SELECTOR);
    console.log(jobDetailsKeysElement.length);
    console.log(jobDetailsValuesElement.length);
    for (let i = 0; i < jobDetailsKeysElement.length; i++) {
        const key = await page.evaluate(el => el.innerText, jobDetailsKeysElement[i]);
        const value = await page.evaluate(el => el.innerText, jobDetailsValuesElement[i]);
        details += key + Constants.EQUALS + value + Constants.JOB_DESCRIPTION_COMPOSITION_DELIMITER;
    }
    jobDetails.jobDetails = details;

    const jobDescriptionElement = await page.$(Constants.EURO_JOBS_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();

    return jobDetails;
}
