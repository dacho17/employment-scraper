import Constants from "../../constants"
import { JobDetails } from "../../dataLayer/models/jobDetails"

export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.SNAPHUNT_DETAILS_JOB_TITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle = jobTitle.trim();

    const workLocationElement = await page.$(Constants.SNAPHUNT_DETAILS_WORK_LOCATION_SELECTOR);
    const workLocation = await page.evaluate(el => el.innerText, workLocationElement);
    jobDetails.workLocation = workLocation.trim();

    const jobDetailsElement = await page.$(Constants.SNAPHUNT_DETAILS_JOB_DETAILS_SELECTOR);
    const details = await page.evaluate(el => el.textContent, jobDetailsElement);
    jobDetails.jobDetails = details.trim();

    const jobOfferElement = await page.$(Constants.SNAPHUNT_DETAILS_JOB_OFFER_SELECTOR);
    const jobDescriptionElement = await page.$(Constants.SNAPHUNT_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobOffer = await page.evaluate(el => el.textContent, jobOfferElement);
    const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobOffer.trim() + '\n' + jobDescription.trim();

    const jobRequirementsElement = await page.$(Constants.SNAPHUNT_DETAILS_JOB_REQUIREMENTS_SELECTOR);
    const jobRequirements = await page.evaluate(el => el.textContent, jobRequirementsElement);
    jobDetails.requiredSkills = jobRequirements.trim();

    return jobDetails;
}
