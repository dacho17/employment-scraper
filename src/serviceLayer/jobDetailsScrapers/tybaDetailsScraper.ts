import Constants from "../../constants"
import { JobDetails } from "../../dataLayer/models/jobDetails"

// jobTitle, companyNam, companyLink, jobDetails(location, hireDuration, skillsRequired)
export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.TYBA_DETAILS_JOB_TITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle = jobTitle.trim();

    const compayNameAndLinkElement = await page.$(Constants.TYBA_DETAILS_COMPANY_NAME_AND_LINK_SELECTOR);
    const companyName = await page.evaluate(el => el.textContent, compayNameAndLinkElement);
    const companyLink = Constants.TYBA_URL + await page.evaluate((el, selector) => el.getAttribute(selector), compayNameAndLinkElement, Constants.HREF_SELECTOR);
    jobDetails.companyName = companyName.trim();
    jobDetails.companyLink = companyLink.trim();

    let details = '';
    const jobDetailsKeyElements = await page.$$(Constants.TYBA_DETAILS_JOB_DETAILS_KEYS_SELECTOR);
    const jobDetailsValueElements = await page.$$(Constants.TYBA_DETAILS_JOB_DETAILS_VALUES_SELECTOR);
    for (let i = 0; i < jobDetailsKeyElements.length; i++) {
        const key = await page.evaluate(el => el.textContent, jobDetailsKeyElements[i]);
        const value = await page.evaluate(el => el.textContent, jobDetailsValueElements[i]);
        details += key.trim() + Constants.EQUALS + value.trim() + Constants.JOB_DESCRIPTION_COMPOSITION_DELIMITER; 
    }
    jobDetails.jobDetails = details;

    const jobDescriptionElement = await page.$(Constants.TYBA_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();
    return jobDetails;
}
