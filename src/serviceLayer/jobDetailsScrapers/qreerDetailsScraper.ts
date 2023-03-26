import Constants from "../../constants"
import { JobDetails } from "../../dataLayer/models/jobDetails"

// jobTite, companyName, companyLink, companyLocation, companyDescription, requiredSkills, jobDetails, jobDescription
export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const registerForm = await page.$(Constants.QREER_DETAILS_REGISTER_FORM_BUTTON_SELECTOR);    // check if register form has appeared
    if (registerForm) {
        await page.evaluate(button => button.click());
    }

    const jobTitleElement = await page.$(Constants.QREER_DETAILS_JOB_TITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle = jobTitle.trim();

    const companyNameElement = await page.$(Constants.QREER_DETAILS_COMPANY_NAME_SELECTOR);
    const companyName = await page.evaluate(el => el.innerText, companyNameElement);
    jobDetails.companyName = companyName.trim();

    const companyLinkElement = await page.$(Constants.QREER_DETAILS_COMPANY_LINK_SELECTOR);
    const companyLink = Constants.QREER_URL + await page.evaluate((el, selector) => el.getAttribute(selector), companyLinkElement, Constants.HREF_SELECTOR);
    jobDetails.companyLink = companyLink.trim();

    const companyLocationElement = await page.$(Constants.QREER_DETAILS_COMPANY_LOCATION_SELECTOR);
    const companyLocation = await page.evaluate(el => el.innerText, companyLocationElement);
    jobDetails.companyLocation = companyLocation.trim();

    const companyInfoElement = await page.$(Constants.QREER_DETAILS_COMPANY_INFO_SELECTOR);
    const companyInfo = await page.evaluate(el => el.textContent, companyInfoElement);
    jobDetails.companyDescription = companyInfo.trim();

    const jobRequirementsElement = await page.$(Constants.QREER_DETAILS_JOB_REQUIREMENTS_SELECTOR);
    const jobRequirements = await page.evaluate(el => el.textContent, jobRequirementsElement);
    jobDetails.requiredSkills = jobRequirements.trim();

    const jobDetailsElement = await page.$(Constants.QREER_DETAILS_JOB_DETAILS_SELECTOR);
    const details = await page.evaluate(el => el.textContent, jobDetailsElement);
    jobDetails.jobDetails = details.trim();

    const jobDescriptionElements = await page.$$(Constants.QREER_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const descriptonTexts = await Promise.all(jobDescriptionElements.map(async element => await page.evaluate(el => el.textContent, element)));
    const jobDescription = descriptonTexts.join('\n');
    jobDetails.jobDescription = jobDescription.trim();    

    return jobDetails;
}
