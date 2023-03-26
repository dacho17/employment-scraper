import Constants from "../../constants"
import { JobDetails } from "../../dataLayer/models/jobDetails"
import Utils from "../../utils/utils";

export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.SIMPLY_HIRED_DETAILS_JOB_TITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle = jobTitle.trim();

    const companyNameElement = await page.$(Constants.SIMPLY_HIRED_DETAILS_COMPANY_NAME_SELECTOR);
    const companyName = await page.evaluate(el => el.innerText, companyNameElement);
    jobDetails.companyName = companyName.trim();

    const companyLocationElement = await page.$(Constants.SIMPLY_HIRED_DETAILS_COMPANY_LOCATION_SELECTOR);
    const companyLocation = await page.evaluate(el => el.textContent, companyLocationElement);
    jobDetails.companyLocation = companyLocation.trim();

    const timeEngagementElement = await page.$(Constants.SIMPLY_HIRED_DETAILS_TIME_ENGAGEMENT_SELECTOR);
    const timeEngagement = await page.evaluate(el => el.textContent, timeEngagementElement);
    jobDetails.timeEngagement = timeEngagement.trim();

    const postedAgoElement = await page.$(Constants.SIMPLY_HIRED_DETAILS_POSTED_AGO_SELECTOR);
    const postedAgo = await page.evaluate(el => el.textContent, postedAgoElement);
    const postedDate = Utils.getPostedDate4SimplyHired(postedAgo.trim());
    jobDetails.postedDate = Utils.transformToTimestamp(postedDate.toString());

    const jobRequirementsElement = await page.$(Constants.SIMPLY_HIRED_DETAILS_JOB_REQUIREMENTS_SELECTOR);
    const jobRequirements = await page.evaluate(el => el.textContent, jobRequirementsElement);
    jobDetails.requiredSkills = jobRequirements.trim();

    const jobBenefitsElement = await page.$(Constants.SIMPLY_HIRED_DETAILS_JOB_BENEFITS_SELECTOR);
    const jobBenefits = await page.evaluate(el => el.textContent, jobBenefitsElement);
    const jobDescriptionElement = await page.$(Constants.SIMPLY_HIRED_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim() + '\n' + jobBenefits.trim();

    return jobDetails;
}
