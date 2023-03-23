import Browser from "../../browserAPI";
import Constants from "../../constants";
import { AdSource } from "../../dataLayer/enums/adSource";
import { EuroJobSitesField } from "../../dataLayer/enums/euroJobSitesField";
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from "../../utils/utils";



function chooseTheSiteBasedOnRequest(fieldOfWork: EuroJobSitesField): string {
    switch(fieldOfWork) {
        case EuroJobSitesField.ENGINEERING:
            return Constants.EURO_ENGINEERING_URL;
        case EuroJobSitesField.SCIENCE:
            return Constants.EURO_SCIENCE_URL;
        case EuroJobSitesField.SPACE:
            return Constants.EURO_SPACE_CAREERS_URL;
        case EuroJobSitesField.TECH:
            return Constants.EURO_TECH_URL;
        default:
            throw Constants.UNDEFINED_FIELD_OF_WORK;
    }
}

async function gatherJobAds(scrapedAds, jobAdElements, baseUrl) {
    let jobLink = null;
    const newAd: JobAd = {
        createdDate: null,
        updatedDate: null,
        source: null,
        jobLink: null
    };
    for (let i = 0; i < jobAdElements.length; i++) {
        jobLink = baseUrl + await jobAdElements[i].evaluate(el => el.getAttribute(Constants.HREF_SELECTOR));

        const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
        newAd.createdDate = currentTimestap;
        newAd.updatedDate = currentTimestap;
        newAd.source = AdSource.EURO_ENGINEER_JOBS;
        newAd.jobLink = jobLink;
        scrapedAds.push(newAd);
    }

    return scrapedAds;
}

export default async function scrapeAds(requestedJobTitle: string, fieldOfWork: EuroJobSitesField): Promise<JobAd[]> {
    const formattedJobTitle = requestedJobTitle.replace(Constants.WHITESPACE, Constants.UNDERSCORE);

    const baseUrl = chooseTheSiteBasedOnRequest(fieldOfWork);
    const url = `${baseUrl}/job_search/keyword/${formattedJobTitle}`;

    const browser = await (new Browser()).run();
    await browser.openPage(url);

    let scrapedAds : JobAd[] = [];
    scrapedAds = await gatherJobAds(scrapedAds, await browser.page.$$(Constants.EURO_ENGINEER_JOBLINKS_SELECTOR_ONE), baseUrl);
    console.log("about to scrape first batch of job ads from " + url + ". ");
    scrapedAds = await gatherJobAds(scrapedAds, await browser.page.$$(Constants.EURO_ENGINEER_JOBLINKS_SELECTOR_TWO), baseUrl);
    console.log("about to scrape second batch of job ads from " + url + ". ");

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browser.closeBrowser();
    return scrapedAds;
}
