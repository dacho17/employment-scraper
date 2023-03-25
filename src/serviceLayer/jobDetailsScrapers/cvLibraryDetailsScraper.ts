import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";
import Utils from "../../utils/utils";

export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.CV_LIBRARY_DETAILS_JOB_TITLE_SELECTOR); // some children are spans > text, some text
    jobDetails.jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle.trim();

    const postedDateElement = await page.$(Constants.CV_LIBRARY_DETAILS_POSTED_AGO_SELECTOR);
    const postedAgo = await page.evaluate(el => el.innerText, postedDateElement);
    const postedDate = Utils.getPostedDate4CvLibrary(postedAgo.trim());
    jobDetails.postedDate = Utils.transformToTimestamp(postedDate.toString());
    
    const companyNameElement = await page.$(Constants.CV_LIBRARY_DETAILS_COMPANY_NAME_SELECTOR);
    const companyName = await page.evaluate(el => el.innerText, companyNameElement);
    jobDetails.companyName = companyName.trim();

    const remoteJobElement = await page.$(Constants.CV_LIBRARY_DETAILS_REMOTE_POSITION_SELECTOR);
    if (remoteJobElement) {
        jobDetails.remote = true;
    }

    const jobDescriptionElement = await page.$(Constants.CV_LIBRARY_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await page.evaluate(el => el.innerText, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();

    const jobDetailsKeyElements = await page.$$(Constants.CV_LIBRARY_DETAILS_JOB_DETAILS_KEY_SELECTOR);
    const jobDetailsValueElements = await page.$$(Constants.CV_LIBRARY_DETAILS_JOB_DETAILS_VALUE_SELECTOR);

    let details = '';
    const workLocation = await page.evaluate(el => el.innerText, jobDetailsValueElements[0]);
    const salary = await page.evaluate(el => el.innerText, jobDetailsValueElements[1]);
    jobDetailsValueElements.shift(); jobDetailsValueElements.shift();
    jobDetailsKeyElements.shift(); jobDetailsKeyElements.shift();
    jobDetails.salary = salary.trim();
    jobDetails.workLocation = workLocation.trim();
    for (let i = 0; i < jobDetailsKeyElements.length; i++) {
        const key = await page.evaluate(el => el.innerText, jobDetailsKeyElements[i]);
        const value = await page.evaluate(el => el.innerText, jobDetailsValueElements[i]);
        details += key + Constants.EQUALS + value + Constants.JOB_DESCRIPTION_COMPOSITION_DELIMITER;
    }
    jobDetails.jobDetails = details.trim();

    return jobDetails;
}
