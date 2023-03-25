import Browser from "../../browserAPI";
import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";

async function scrapeData(page: any,): Promise<JobDetails> {
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
    
    // officeLoc, timeEngag (+ rem)Conts
    const jobSubtitleElement = await page.$$(Constants.CAREER_BUILDER_DETAILS_JOB_SUBTITLE_SELECTOR);
    const officeLocation = await page.evaluate(elem => elem.innerText, jobSubtitleElement[0]);
    adDetails.companyLocation = officeLocation.trim();

    const timeEngagement = await page.evaluate(elem => elem.innerText, jobSubtitleElement[1]);
    adDetails.timeEngagement = timeEngagement.trim(); 

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
