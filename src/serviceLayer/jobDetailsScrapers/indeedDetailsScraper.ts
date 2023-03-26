import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";
import Utils from "../../utils/utils";


// NOTE: Access denied when trying to scrape a page. From what I recall, same happened when trying to scrape ads.
// This however, might be useful if I find a way to access the page so I will leave it here
export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    console.log(await page.content());

    const jobTitleElement = await page.$(Constants.INDEED_DETAILS_JOB_TITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle = jobTitle.trim();

    const companyNameAndLinkElement = await page.$(Constants.INDEED_DETAILS_COMPANY_NAME_AND_LINK_SELECTOR);
    const companyName = await page.evaluate(el => el.innerText, companyNameAndLinkElement);
    const companyLink = await page.evaluate((el, selector) => el.getAttribute(selector), companyNameAndLinkElement, Constants.HREF_SELECTOR);
    jobDetails.companyName = companyName.trim();
    jobDetails.companyLink = companyLink.trim();
    
    const companyDescriptionElement = await page.$(Constants.INDEED_DETAILS_COMPANY_DESCRIPTION_SELECTOR);
    const companyDescription = await page.evaluate(el => el.innerText, companyDescriptionElement);
    jobDetails.companyDescription = companyDescription.trim();

    const companyLocationElement = await page.$(Constants.INDEED_DETAILS_COMPANY_LOCATION_SELECTOR);
    const companyLocation = await page.evaluate(el => el.innerText, companyLocationElement);
    jobDetails.companyLocation = companyLocation.trim();

    const salaryElement = await page.$(Constants.INDEED_DETAILS_SALARY_SELECTOR);
    const salary = await page.evaluate(el => el.innerText, salaryElement);
    jobDetails.salary = salary.trim();

    const timeEngagementElement = await page.$(Constants.INDEED_DETAILS_TIME_ENGAGEMENT_SELECTOR);
    const timeEngagement = await page.evaluate(el => el.innerText, timeEngagementElement);
    jobDetails.timeEngagement = timeEngagement.trim();

    const jobDetailsElement = await page.$(Constants.INDEED_DETAILS_JOB_DETAILS_SELECTOR);
    const details = await page.evaluate(el => el.textContent, jobDetailsElement);
    jobDetails.jobDetails = details.trim();

    const jobDescriptionElement = await page.$(Constants.INDEED_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await page.evaulate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();

    const postedAgoElement = await page.$(Constants.INDEED_DETAILS_POSTED_AGO_SELECTOR);
    const postedAgo = await page.evaluate(el => el.innerText, postedAgoElement);
    const postedDate = Utils.getPostedDate4Indeed(postedAgo);
    jobDetails.postedDate = Utils.transformToTimestamp(postedDate.toString());

    console.log(jobDetails);
    return jobDetails;
}
