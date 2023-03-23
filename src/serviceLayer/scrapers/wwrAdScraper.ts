import Browser from "../../browserAPI";
import Constants from "../../constants";
import { AdSource } from "../../dataLayer/enums/adSource";
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from "../../utils/utils";


async function scrapePartOfAds(jobAdElements, scrapedAds: JobAd[]) {
    let jobLink = null;
    const newAd: JobAd = {
        createdDate: null,
        updatedDate: null,
        source: null,
        jobLink: null
    };
    for (let j = 0; j < jobAdElements.length; j++) {
        jobLink = await jobAdElements[j].evaluate(el => el.getAttribute(Constants.HREF_SELECTOR));
        jobLink = 'https://weworkremotely.com' + jobLink.trim();

        const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
        newAd.createdDate = currentTimestap;
        newAd.updatedDate = currentTimestap;
        newAd.source = AdSource.WE_WORK_REMOTELY;
        newAd.jobLink = jobLink;
        scrapedAds.push(newAd);
    }
}

export default async function scrapeAds(): Promise<JobAd[]> {
    const browser = await (new Browser()).run();
    const url = 'https://weworkremotely.com/remote-jobs/';
    await browser.openPage(url);

    // scrape directly from the main page those who do not have .view-all. Otherwise access the separate urls and scrape from there
    const showAllJobsUrls: string[] = [];
    const jobSectionElements = await browser.page.$$(Constants.WE_WORK_REMOTELY_JOB_SECTION_SELECTOR);
    const sectionsToBeScrapedFromMain = [];
    let jobUrlElement = null;
    let newUrl: string | null = null;
    for (let i = 0; i < jobSectionElements.length; i++) {
        jobUrlElement = await jobSectionElements[i].$(Constants.WE_WORK_REMOTELY_VIEW_ALL_JOBS_SELECTOR);
        if (jobUrlElement === null) {
            sectionsToBeScrapedFromMain.push(i);
            continue;
        }
        newUrl = 'https://weworkremotely.com' + await jobUrlElement.evaluate(el => el.getAttribute(Constants.HREF_SELECTOR));
        showAllJobsUrls.push(newUrl.trim());
    }
    console.log(showAllJobsUrls.length + " additional job pages will be scraped.");     // scraping the pages other than the main one (the ones with higher number of ads)

    // scraping the main page
    const jobAdsOnMainPage = [];
    const allJobSections = await browser.page.$$(Constants.WE_WORK_REMOTELY_JOB_SECTION_SELECTOR);
    let jobAdElements = [];
    for (let i = 0; i < sectionsToBeScrapedFromMain.length; i++) {
        // let jobSectionFromMainPage = await page.$(`.jobs-container > .jobs:nth-child(${sectionsToBeScrapedFromMain[i].toString()})`); //   > article > ul
        jobAdElements = await allJobSections[sectionsToBeScrapedFromMain[i]].$$(Constants.WE_WORK_REMOTELY_JOBLINKS_SELECTOR);
        jobAdsOnMainPage.push(...jobAdElements);
    }
    console.log(jobAdsOnMainPage.length + " jobs have been found on the main page");

    console.log("starting to scrape the main page");
    const scrapedAds: JobAd[] = [];
    await scrapePartOfAds(jobAdsOnMainPage, scrapedAds);
    console.log(scrapedAds.length + ' jobs have been scraped from the main page');

    console.log("starting to scrape separate pages");
    jobAdElements = null;
    for (let i = 0; i < showAllJobsUrls.length; i++) {
        await browser.openPage(showAllJobsUrls[i]);

        jobAdElements = await browser.page.$$(Constants.WE_WORK_REMOTELY_JOBLINKS_SELECTOR_TWO); // not the first and the last one
        jobAdElements.shift();
        jobAdElements.pop();
        console.log(jobAdElements.length + ' jobs found on the page ' + showAllJobsUrls[i]);
        await scrapePartOfAds(jobAdElements, scrapedAds);
    }

    console.log(scrapedAds.length + " jobs have been scraped in total.");

    await browser.closeBrowser();
    return scrapedAds;
}
