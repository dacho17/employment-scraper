import Constants from "../../constants"
import { JobDetails } from "../../dataLayer/models/jobDetails"
import Utils from "../../utils/utils";

// jobTitle, companyName, companyLocation, companyWebiste, companyLink, postedAgo, nOfApplicants, jobDetails, jobDescription
export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.WE_WORK_REMOTELY_DETAIL_JOB_TITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle = jobTitle.trim();

    const compayNameAndLinkElement = await page.$(Constants.WE_WORK_REMOTELY_COMPANY_NAME_AND_LINK_SELECTOR);
    const companyName = await page.evaluate(el => el.textContent, compayNameAndLinkElement);
    const companyLink = Constants.WE_WORK_REMOTELY_URL + await page.evaluate((el, selector) => el.getAttribute(selector), compayNameAndLinkElement, Constants.HREF_SELECTOR);
    jobDetails.companyName = companyName.trim();
    jobDetails.companyLink = companyLink.trim();

    const companyWebsiteElement = await page.$(Constants.WE_WORK_REMOTELY_COMPANY_WEBSITE_SELECTOR);
    const companyWebsite = await page.evaluate((el, selector) => el.getAttribute(selector), companyWebsiteElement, Constants.HREF_SELECTOR);
    jobDetails.companyWebsite = companyWebsite.trim();

    const companyLocationElement = await page.$(Constants.WE_WORK_REMOTELY_COMPANY_LOCATION_SELECTOR);
    const companyLocation = await page.evaluate(el => el.innerText, companyLocationElement);
    jobDetails.workLocation = companyLocation.trim();

    const postedAgoElement = await page.$(Constants.WE_WORK_REMOTELY_POSTED_DATE_SELECTOR);
    const postedDate = await page.evaluate((el, selector) => el.getAttribute(selector), postedAgoElement, Constants.DATETIME_SELECTOR);
    jobDetails.postedDate = Utils.transformToTimestamp(postedDate.toString());

    const numberOfApplicantsElement = await page.$(Constants.WE_WORK_REMOTELY_NUMBER_OF_APPLICANTS_SELECTOR);
    const numberOfApplicants = await page.evaluate(el => el.textContent, numberOfApplicantsElement);
    jobDetails.nOfApplicants = Utils.getNumberOfApplicantsWWR(numberOfApplicants.trim());

    const jobDetailsElement = await page.$(Constants.WE_WORK_REMOTELY_JOB_DETAILS_SELECTOR);
    const details = await page.evaluate(el => el.textContent, jobDetailsElement);
    jobDetails.jobDetails = details.trim();

    const jobDescriptionElement = await page.$(Constants.WE_WORK_REMOTELY_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();
    
    return jobDetails;
}
