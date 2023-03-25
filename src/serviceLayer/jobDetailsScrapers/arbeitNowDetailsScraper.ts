import Browser from "../../browserAPI.js";
import Constants from "../../constants.js";
import { JobDetails } from "../../dataLayer/models/jobDetails.js";
import Utils from '../../utils/utils.js'

async function scrapeData(page: any, url: string): Promise<JobDetails> {
    const adDetails: JobDetails = {
        jobTitle: null,
        companyName: null,
        companyLocation: null,
        // salary: null,
        // experienceLevel: null,
        // skills: null,
        jobDetails: null,
        timeEngagement: null,
        postedDate: null,
        jobDescription: null
    }

    const jobTitleElement = await page.$(Constants.ARBEITNOW_DETAILS_JOB_TITLE_SELECTOR);
    adDetails.jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    adDetails.jobTitle.trim();

    const companyNameElement = await page.$(Constants.ARBEITNOW_DETAILS_COMPANY_NAME_SELECTOR);
    adDetails.companyName = await page.evaluate(el => el.innerText, companyNameElement);
    adDetails.companyName.trim();
    
    const companyLocationElement = await page.$(Constants.ARBEITNOW_DETAILS_COMPANY_LOCATION_SELECTOR);
    adDetails.companyLocation = await page.evaluate(el => el.innerText, companyLocationElement);
    adDetails.companyLocation.trim();

    // TODO: using Constants.ARBEITNOW_JOB_DETAILS_SELECTOR extract the jobDetails from this page!
    // const jobDetailsSection = await page.$('.list-none > div > div > div > div > div > div');

    const postedDateElement = await page.$(Constants.ARBEITNOW_DETAILS_POSTED_DATE_SELECTOR);
    const postedDate = await page.evaluate((el, selector) => el.getAttribute(selector), postedDateElement, Constants.DATETIME_SELECTOR);
    adDetails.postedDate = Utils.transformToTimestamp(postedDate.trim());

    const jobDescriptionElement = await page.$(Constants.ARBEITNOW_DETAILS_JOB_DESCRIPTION_SELECTOR);
    adDetails.jobDescription = await page.evaluate(el => el.innerText, jobDescriptionElement);
    adDetails.jobDescription.trim();

    return adDetails;
}

export default async function scrapeSite(): Promise<any> {
    // TODO: make the url dynamic
    const url = 'https://www.arbeitnow.com/view/roetgen-hauptstrasse-padagogische-fachkraft-in-der-krippe-dibber-ggmbh-208571';
    const browser = await Browser.run();
    const page = await Browser.openPage(browser, url);
    const arbeitNowAdDetails = await scrapeData(page, url);

    console.log(arbeitNowAdDetails);

    console.log('scrape finished');
    await Browser.close(browser);
    return arbeitNowAdDetails;
}
