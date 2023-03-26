import Browser from '../../browserAPI.js';
import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';
import { EuroJobSitesField } from "../../dataLayer/enums/euroJobSitesField.js";

function chooseTheSiteBasedOnRequest(fieldOfWork: string): [string, AdSource] {
    switch(fieldOfWork) {
        case EuroJobSitesField.ENGINEERING:
            return [Constants.EURO_ENGINEERING_URL, AdSource.EURO_ENGINEER_JOBS];
        case EuroJobSitesField.SCIENCE:
            return [Constants.EURO_SCIENCE_URL, AdSource.EURO_SCIENCE_JOBS];
        case EuroJobSitesField.SPACE:
            return [Constants.EURO_SPACE_CAREERS_URL, AdSource.EURO_SPACE_CAREERS];
        case EuroJobSitesField.TECH:
            return [Constants.EURO_TECH_URL, AdSource.EURO_TECH_JOBS];
        default:
            throw Constants.UNDEFINED_FIELD_OF_WORK;
    }
}

async function gatherJobAds(scrapedAds: JobAd[], adSource: AdSource, baseUrl: string, page: any, selector: string): Promise<JobAd[]> {
    const jobAdElements = await page.$$(selector);
    for (let i = 0; i < jobAdElements.length; i++) {
        const jobLink = baseUrl + await page.evaluate((el, selector) => el.getAttribute(selector), jobAdElements[i], Constants.HREF_SELECTOR);
        
        const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
        const newAd: JobAd = {
            createdDate: currentTimestap,
            updatedDate: currentTimestap,
            source: adSource,
            jobLink: jobLink
        }
        scrapedAds.push(newAd);
    }

    return scrapedAds;
}

// jobTitle, companyName, companyLocation, shortDescription, postedAgo, applicationDeadline
export default async function scrapeAds(reqJobTitle: string, fieldOfWork: string): Promise<JobAd[]> {
    
    const formattedJobTitle = reqJobTitle.replace(Constants.WHITESPACE, Constants.UNDERSCORE);
    
    const [baseUrl, adSource] = chooseTheSiteBasedOnRequest(fieldOfWork);
    const url = `${baseUrl}/job_search/keyword/${formattedJobTitle}`;

    const browser = await Browser.run();
    const page = await Browser.openPage(browser, url);

    let scrapedAds : JobAd[] = [];
    scrapedAds = await gatherJobAds(scrapedAds, adSource, baseUrl, page, Constants.EURO_JOBS_JOBLINKS_SELECTOR_ONE);
    console.log("about to scrape first batch of job ads from " + url + ". ");
    scrapedAds = await gatherJobAds(scrapedAds, adSource, baseUrl, page, Constants.EURO_JOBS_JOBLINKS_SELECTOR_TWO);
    console.log("about to scrape second batch of job ads from " + url + ". ");

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await Browser.close(browser);
    return scrapedAds;
}
