import Browser from "../../browserAPI";
import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";

async function scrapeSubtitleSection(page: any, adDetails: JobDetails) {
    // Properties on the website: companyName - maybe, officeLoc, timeEngag (+ rem)
    const jobSubtitleElement = await page.$$(Constants.CAREER_BUILDER_DETAILS_JOB_SUBTITLE_SELECTOR);
    let firstSubtitleProperty = await page.evaluate(elem => elem.innerText, jobSubtitleElement[0]);
    firstSubtitleProperty = firstSubtitleProperty.trim();

    let secondSubtitleProperty = await page.evaluate(elem => elem.innerText, jobSubtitleElement[1]);
    secondSubtitleProperty = secondSubtitleProperty.trim();
    
    if (jobSubtitleElement.length === 3) {
        const thirdSubtitleProperty = await page.evaluate(elem => elem.innerText, jobSubtitleElement[2]);
        adDetails.companyName = firstSubtitleProperty;
        adDetails.companyLocation = secondSubtitleProperty
        adDetails.timeEngagement = thirdSubtitleProperty.trim();
    } else {
        adDetails.companyLocation = firstSubtitleProperty;
        adDetails.timeEngagement = secondSubtitleProperty;
    }
} 

async function scrapeData(page: any): Promise<JobDetails> {
    const adDetails: JobDetails = {
        jobTitle: null,
        companyName: null,
        companyLocation: null,
        jobDetails: null,
        timeEngagement: null,
        postedDate: null,
        jobDescription: null
    };

    const jobTitleElement = await page.$(Constants.CAREER_BUILDER_DETAILS_JOB_TITLE_SELECTOR);
    adDetails.jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    adDetails.jobTitle.trim();
    
    await scrapeSubtitleSection(page, adDetails);
    
    const jobDescriptionElement = await page.$(Constants.CAREER_BUILDER_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await page.evaluate(elem => elem.innerText, jobDescriptionElement);
    adDetails.jobDescription = jobDescription.trim();

    const listOfRequiredSkillElements = await page.$$(Constants.CAREER_BUILDER_DETAILS_REQUIRED_SKILLS_SELECTOR);
    const requiredSkills = await Promise.all(listOfRequiredSkillElements.map(async elem => await page.evaluate(el => el.innerText.trim(), elem)));

    adDetails.requiredSkills = requiredSkills.join(', ');
    console.log(requiredSkills.length);

    return adDetails;
}

export default async function scrapeSite(): Promise<JobDetails> {
    // TODO: make the url dynamic
    const url = 'https://www.careerbuilder.com/job/JMD8868H59367G27E5V';
    const browser = await Browser.run();
    const page = await Browser.openPage(browser, url);
    const arbeitNowAdDetails = await scrapeData(page);

    console.log(arbeitNowAdDetails);

    console.log('scrape finished');
    await Browser.close(browser);
    return arbeitNowAdDetails;
}
