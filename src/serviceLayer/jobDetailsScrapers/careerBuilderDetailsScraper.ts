import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";

async function scrapeSubtitleSection(page: any, jobDetails: JobDetails) {
    const jobSubtitleElement = await page.$$(Constants.CAREER_BUILDER_DETAILS_JOB_SUBTITLE_SELECTOR);
    let firstSubtitleProperty = await page.evaluate(elem => elem.innerText, jobSubtitleElement[0]);
    firstSubtitleProperty = firstSubtitleProperty.trim();

    let secondSubtitleProperty = await page.evaluate(elem => elem.innerText, jobSubtitleElement[1]);
    secondSubtitleProperty = secondSubtitleProperty.trim();
    
    if (jobSubtitleElement.length === 3) {
        const thirdSubtitleProperty = await page.evaluate(elem => elem.innerText, jobSubtitleElement[2]);
        jobDetails.companyName = firstSubtitleProperty;
        jobDetails.companyLocation = secondSubtitleProperty
        jobDetails.timeEngagement = thirdSubtitleProperty.trim();
    } else {
        jobDetails.companyLocation = firstSubtitleProperty;
        jobDetails.timeEngagement = secondSubtitleProperty;
    }
} 

// postedAgo, jobTitle, companyName, officeLocation, timeEngagement
export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const jobTitleElement = await page.$(Constants.CAREER_BUILDER_DETAILS_JOB_TITLE_SELECTOR);
    jobDetails.jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle.trim();
    
    await scrapeSubtitleSection(page, jobDetails);
    
    const jobDescriptionElement = await page.$(Constants.CAREER_BUILDER_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await page.evaluate(elem => elem.innerText, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();

    const listOfRequiredSkillElements = await page.$$(Constants.CAREER_BUILDER_DETAILS_REQUIRED_SKILLS_SELECTOR);
    const requiredSkills = await Promise.all(listOfRequiredSkillElements.map(async elem => await page.evaluate(el => el.innerText.trim(), elem)));

    jobDetails.requiredSkills = requiredSkills.join(', ');
    console.log(requiredSkills.length);

    return jobDetails;
}
