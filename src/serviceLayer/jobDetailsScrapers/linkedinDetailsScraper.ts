import Constants from "../../constants"
import { JobDetails } from "../../dataLayer/models/jobDetails"
import Utils from "../../utils/utils";

export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.LN_DETAILS_JOBTITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle = jobTitle.trim();

    const companyNameAndLinkElement = await page.$(Constants.LN_DETAILS_COMPANY_NAME_AND_LINK_SELECTOR);
    const companyName = await page.evaluate(el => el.innerText, companyNameAndLinkElement);
    const companyLink = await page.evaluate((el, selector) => el.getAttribute(selector), companyNameAndLinkElement, Constants.HREF_SELECTOR);
    jobDetails.companyName = companyName.trim();
    jobDetails.companyLink = companyLink.trim();

    // LN_DETAILS_SHOW_MORE_BUTTON_SELECTOR: '.show-more-less-html__button--more', // do I need this?
    const companyLocationElement = await page.$(Constants.LN_DETAILS_COMPANY_LOCATION_SELECTOR);
    const companyLocation = await page.evaluate(el => el.innerText, companyLocationElement);
    jobDetails.companyLocation = companyLocation.trim();

    const postedAgoElement = await page.$(Constants.LN_DETAILS_POSTED_AGO_SELECTOR);
    const postedAgo = await page.evaluate(el => el.innerText, postedAgoElement);
    const postedDate = Utils.getPostedDate4LinkedIn(postedAgo.trim());
    jobDetails.postedDate = Utils.transformToTimestamp(postedDate.toString());

    const nOfApplicantsElement = await page.$(Constants.LN_DETAILS_NUMBER_OF_APPLICANTS_SELECTOR);
    const nOfApplicantsText = await page.evaluate(el => el.innerText, nOfApplicantsElement);
    jobDetails.nOfApplicants = nOfApplicantsText.trim();
    
    const detailsElement = await page.$(Constants.LN_DETAILS_JOB_DETAILS_SELECTOR);
    const details = await page.evaluate(el => el.textContent, detailsElement);
    jobDetails.jobDetails = details.trim();
    
    const jobDescriptionElement = await page.$(Constants.LN_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();

    return jobDetails;
}
