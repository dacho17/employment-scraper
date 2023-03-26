import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails"

export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {

    const jobTitleElement = await page.$(Constants.JOBS_IN_NETWORK_DETAILS_JOB_TITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle = jobTitle.trim();

    const jobDetailsElement = await page.$(Constants.JOBS_IN_NETWORK_DETAILS_JOB_DETAILS_SELECTOR);
    const details = await page.evaluate(el => el.textContent, jobDetailsElement);
    jobDetails.jobDetails = details.trim();

    const jobDescriptionElement = await page.$(Constants.JOBS_IN_NETWORK_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();

    return jobDetails;
}
