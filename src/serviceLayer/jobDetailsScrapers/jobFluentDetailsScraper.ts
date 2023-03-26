import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails"

export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.JOB_FLUENT_DETAILS_JOB_TITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle = jobTitle.trim();

    const companyLocationElement = await page.$(Constants.JOB_FLUENT_DETAILS_COMPANY_LOCATION_SELECTOR);
    const companyLocation = await page.evaluate(el => el.innerText, companyLocationElement);
    jobDetails.companyLocation = companyLocation.trim();

    const companyNameElement = await page.$(Constants.JOB_FLUENT_DETAILS_COMPANY_NAME_SELECTOR);
    const companyName = await page.evaluate(el => el.innerText, companyNameElement);
    jobDetails.companyName = companyName.trim();
    
    const companyLinkElement = await page.$(Constants.JOB_FLUENT_DETAILS_COMPANY_LINK_SELECTOR);
    const companyLink = await page.evaluate((el, selector) => el.getAttribute(selector), companyLinkElement, Constants.HREF_SELECTOR);    
    jobDetails.companyLink = companyLink.trim();

    const companyDetailsElement = await page.$(Constants.JOB_FLUENT_DETAILS_COMPANY_DETAILS_SELECTOR);
    const companyDetails = await page.evaluate(el => el.textContent, companyDetailsElement);
    jobDetails.companyDetails = companyDetails.trim();

    const remotePositionElement = await page.$(Constants.JOB_FLUENT_DETAILS_REMOTE_SELECTOR);
    jobDetails.isRemote = remotePositionElement !== null;

    const timeEngagementElement = await page.$(Constants.JOB_FLUENT_DETAILS_TIME_ENGAGEMENT_SELECTOR);
    const timeEngagement = await page.evaluate(el => el.innerText, timeEngagementElement);
    jobDetails.timeEngagement = timeEngagement.trim();

    const isNotInternshipElement = await page.$(Constants.JOB_FLUENT_DETAILS_INTERNSHIP_SELECTOR);
    jobDetails.isInternship = isNotInternshipElement === null;

    // get data from content attribute
    const requiredSkillsElement = await page.$(Constants.JOB_FLUENT_DETAILS_REQUIRED_SKILLS);
    const requiredSkills = await page.evaluate((el, selector) => el.getAttribute(selector), requiredSkillsElement, 'content')
    jobDetails.requiredSkills = requiredSkills.trim();

    const jobDescriptionElement = await page.$(Constants.JOB_FLUENT_DETAILS_JOB_DESCRIPTION);
    const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();

    console.log(jobDetails);
    return jobDetails;
}  
