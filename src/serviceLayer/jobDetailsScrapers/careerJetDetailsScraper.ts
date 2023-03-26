import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";
import Utils from "../../utils/utils";

async function scrapeSubtitleSection(subtitleSectionElements: string[], adDetails: JobDetails): Promise<void> {
    adDetails.companyLocation = subtitleSectionElements[0];
    if (subtitleSectionElements.length === 3) {
        adDetails.timeEngagement = subtitleSectionElements[1] + Constants.JOB_DESCRIPTION_COMPOSITION_DELIMITER +  subtitleSectionElements[2];
    } else if (subtitleSectionElements.length === 4) {
        adDetails.salary = subtitleSectionElements[1];
        adDetails.timeEngagement = subtitleSectionElements[2] + Constants.JOB_DESCRIPTION_COMPOSITION_DELIMITER +  subtitleSectionElements[3];
    } else {
        throw `During CareerJetDetails Scraping - unexpected number of elements appeared ${subtitleSectionElements.length}`;
    }
} 

// jobTitle, companyName, companyLocation, timeEngagement, salary, postedDate, jobDescription
export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.CAREER_JET_DETAILS_JOB_TITLE_SELECTOR);
    jobDetails.jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle.trim();

    const companyNameElement = await page.$(Constants.CAREER_JET_DETAILS_COMPANY_NAME_SELECTOR);
    jobDetails.companyName = await page.evaluate(el => el.innerText, companyNameElement);
    jobDetails.companyName.trim();

    const jobSubtitleElements = await page.$$(Constants.CAREER_JET_DETAILS_JOB_SUBTITLE_SELECTOR);
    const jobSubtitleData = await Promise.all(jobSubtitleElements.map(async elem => await page.evaluate(el => el.innerText.trim(), elem)));
    await scrapeSubtitleSection(jobSubtitleData, jobDetails);

    const postedAgoElement = await page.$(Constants.CAREER_JET_DETAILS_POSTED_AGO_SELECTOR);
    const postedAgo = await page.evaluate(el => el.innerText, postedAgoElement);
    const postedDate = Utils.getPostedDate4CareerJet(postedAgo);
    jobDetails.postedDate = Utils.transformToTimestamp(postedDate.toString());

    const jobDescriptionElement = await page.$(Constants.CAREER_JET_DETAILS_JOB_DESCRIPTION_SELECTOR);
    jobDetails.jobDescription = await page.evaluate(el => el.innerText, jobDescriptionElement);
    jobDetails.jobDescription.trim();

    return jobDetails;
}
