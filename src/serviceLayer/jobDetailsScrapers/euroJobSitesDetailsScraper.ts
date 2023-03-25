import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";

export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobHeaderElement = await page.$$(Constants.EURO_JOB_SITES_DETAILS_HEADER_SELECTOR);
    const additionalJobLinkElement = await page.$(Constants.EURO_JOB_SITES_DETAILS_ADDITIONAL_JOB_LINK_SELECTOR);
    const additionalJobLink = await page.evaluate((el, selector) => el.getAttribute(selector), additionalJobLinkElement, Constants.HREF_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobHeaderElement[1]);
    const companyName = await page.evaluate(el => el.innerText, jobHeaderElement[2]);
    const companyLocation = await page.evaluate(el => el.innerText, jobHeaderElement[3]);

    jobDetails.additionalJobLink = url.substring(0, url.indexOf('.com') + 4) + additionalJobLink.trim();
    jobDetails.jobTitle = jobTitle.trim();
    jobDetails.companyName = companyName.trim();
    jobDetails.companyLocation = companyLocation.trim();

    const jobDescriptionElement = await page.$(Constants.EURO_JOB_SITES_DETAILS_AD_SELECTOR);
    const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();

    return jobDetails;
}
