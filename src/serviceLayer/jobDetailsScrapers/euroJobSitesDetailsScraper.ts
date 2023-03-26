import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";

// jobTitle, companyName, companyLocation, jobDescription, 
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

    const jobDetailsKeysElement = await page.$$(Constants.EURO_JOB_SITES_DETAILS_JOB_DETAILS_KEYS_SELECTOR);
     const jobDetailsKeys = await Promise.all(jobDetailsKeysElement.map(async element => await page.evaluate(el => el.innerText, element)));
    const jobDetailsElement = await page.$(Constants.EURO_JOB_SITES_DETAILS_JOB_DETAILS_SELECTOR);
    let details = await page.evaluate(el => el.textContent, jobDetailsElement);
    let isFirstElem = true;
    for (let i = 0; i < jobDetailsKeys.length; i++) {
        if (isFirstElem) {
            isFirstElem = false;
            continue;
        }
        const delimiterIndex = details.indexOf(jobDetailsKeys[i]);
        details = details.slice(0, delimiterIndex) + Constants.JOB_DESCRIPTION_COMPOSITION_DELIMITER + details.slice(delimiterIndex);
    }
    details = details.replaceAll(": ", "=");

    jobDetails.jobDetails = details.trim();

    const jobDescriptionElement = await page.$(Constants.EURO_JOB_SITES_DETAILS_AD_SELECTOR);
    const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();

    return jobDetails;
}
