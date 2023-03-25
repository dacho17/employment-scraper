import Browser from "../../browserAPI"
import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";

async function scrapeData(page: any, url: string): Promise<JobDetails> {
    const adzunaAdDetails = {
        jobTitle: null,
        companyName: null,
        companyLocation: null,
        timeEngagement: null,
        jobDescription: null
    }

    const extendAdButton = await page.$(Constants.ADZUNA_DETAILS_EXTEND_AD_BUTTON_SELECTOR);    // button to extend the ad
    await page.evaluate(button => button.click(), extendAdButton);

    const jobTitleElement = await page.$(Constants.ADZUNA_DETAILS_JOB_TITLE_SELECTOR);
    adzunaAdDetails.jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);

    const subTitleSectionElement = await page.$$(Constants.ADZUNA_DETAILS_SUBTITLE_SECTION_SELECTOR);
    try {
        adzunaAdDetails.companyLocation = await page.evaluate(el => el.innerText, subTitleSectionElement[0]);
    } catch (exception) {
        console.log('companyLocation could not be scraped from ' + url);
    }
    try {
        adzunaAdDetails.companyName = await page.evaluate(el => el.innerText, subTitleSectionElement[1]);
    } catch (exception) {
        console.log('companyName could not be scraped from ' + url);
    }
    try {
        adzunaAdDetails.timeEngagement = await page.evaluate(el => el.innerText, subTitleSectionElement[2]);
    } catch (exception) {
        console.log('timeEngagement could not be scraped from ' + url);
    }

    const descriptionElement = await page.$(Constants.ADZUNA_DETAILS_JOB_DESCRIPTION_SELECTOR);
    adzunaAdDetails.jobDescription = await page.evaluate(el => el.innerText, descriptionElement);

    return adzunaAdDetails;
}

export default async function scrapeSite(): Promise<any> {
    const url = 'https://www.adzuna.com/details/3993306546';    // TODO: make this dynamic
    const browser = await Browser.run();
    const page = await Browser.openPage(browser, url);
    const adzunaAdDetails = await scrapeData(page, url);

    console.log('scrape finished');
    await Browser.close(browser);
    return adzunaAdDetails;
}
