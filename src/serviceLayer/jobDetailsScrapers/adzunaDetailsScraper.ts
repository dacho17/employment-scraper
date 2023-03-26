import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";

// jobTitle, companyName, officeLocation, description, timeEngagements
export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const extendAdButton = await page.$(Constants.ADZUNA_DETAILS_EXTEND_AD_BUTTON_SELECTOR);    // button to extend the ad
    await page.evaluate(button => button.click(), extendAdButton);

    const jobTitleElement = await page.$(Constants.ADZUNA_DETAILS_JOB_TITLE_SELECTOR);
    jobDetails.jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);

    const subTitleSectionElement = await page.$$(Constants.ADZUNA_DETAILS_SUBTITLE_SECTION_SELECTOR);
    try {
        jobDetails.companyLocation = await page.evaluate(el => el.innerText, subTitleSectionElement[0]);
    } catch (exception) {
        console.log('companyLocation could not be scraped from ' + url);
    }
    try {
        jobDetails.companyName = await page.evaluate(el => el.innerText, subTitleSectionElement[1]);
    } catch (exception) {
        console.log('companyName could not be scraped from ' + url);
    }
    try {
        jobDetails.timeEngagement = await page.evaluate(el => el.innerText, subTitleSectionElement[2]);
    } catch (exception) {
        console.log('timeEngagement could not be scraped from ' + url);
    }

    const descriptionElement = await page.$(Constants.ADZUNA_DETAILS_JOB_DESCRIPTION_SELECTOR);
    jobDetails.jobDescription = await page.evaluate(el => el.innerText, descriptionElement);

    return jobDetails;
}
