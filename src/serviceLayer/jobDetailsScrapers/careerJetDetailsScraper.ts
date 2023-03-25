import Browser from "../../browserAPI";
import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";
import Utils from "../../utils/utils";


async function scrapeSubtitleSection(subtitleSectionElements: string[], adDetails: JobDetails): Promise<void> {
    // Properties in this section: companyLocation, salary-maybe, timeEngagement divided into two parts
    
    adDetails.companyLocation = subtitleSectionElements[0];
    if (subtitleSectionElements.length === 3) {
        adDetails.timeEngagement = subtitleSectionElements[1] + ', ' +  subtitleSectionElements[2];
    } else if (subtitleSectionElements.length === 4) {
        adDetails.salary = subtitleSectionElements[1];
        adDetails.timeEngagement = subtitleSectionElements[2] + ', ' +  subtitleSectionElements[3];
    } else {
        throw `During CareerJetDetails Scraping - unexpected number of elements appeared ${subtitleSectionElements.length}`;
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

    const jobTitleElement = await page.$(Constants.CAREER_JET_DETAILS_JOB_TITLE_SELECTOR);
    adDetails.jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    adDetails.jobTitle.trim();

    const companyNameElement = await page.$(Constants.CAREER_JET_DETAILS_COMPANY_NAME_SELECTOR);
    adDetails.companyName = await page.evaluate(el => el.innerText, companyNameElement);
    adDetails.companyName.trim();

    const jobSubtitleElements = await page.$$(Constants.CAREER_JET_DETAILS_JOB_SUBTITLE_SELECTOR);
    const jobSubtitleData = await Promise.all(jobSubtitleElements.map(async elem => await page.evaluate(el => el.innerText.trim(), elem)));
    await scrapeSubtitleSection(jobSubtitleData, adDetails);

    const postedAgoElement = await page.$(Constants.CAREER_JET_DETAILS_POSTED_AGO_SELECTOR);
    const postedAgo = await page.evaluate(el => el.innerText, postedAgoElement);
    console.log(postedAgo);
    const postedDate = Utils.getPostedDate4CareerJet(postedAgo);
    console.log(postedDate);
    adDetails.postedDate = Utils.transformToTimestamp(postedDate.toString());

    const jobDescriptionElement = await page.$(Constants.CAREER_JET_DETAILS_JOB_DESCRIPTION_SELECTOR);
    adDetails.jobDescription = await page.evaluate(el => el.innerText, jobDescriptionElement);
    adDetails.jobDescription.trim();

    return adDetails;
}

export default async function scrapeSite() {
    // TODO: make the url dynamic
    const url = 'https://www.careerjet.com/jobad/usabd6878701761e42480d02bbaa3763b0';
    const browser = await Browser.run();
    const page = await Browser.openPage(browser, url);
    const arbeitNowAdDetails = await scrapeData(page);

    console.log('scrape finished');
    await Browser.close(browser);
    return arbeitNowAdDetails;
}
