import Browser from '../../browserAPI.js';
import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';


async function storeLinksInScrapedAds(jobAdElements, page, scrapedAds: JobAd[]) {
    for (let j = 0; j < jobAdElements.length; j++) {
        let jobLink = await page.evaluate((el, selector) => el.getAttribute(selector), jobAdElements[j], Constants.HREF_SELECTOR);
        jobLink = Constants.WE_WORK_REMOTELY_URL + jobLink.trim();

        const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
        const newAd: JobAd = {
            createdDate: currentTimestap,
            updatedDate: currentTimestap,
            source: AdSource.WE_WORK_REMOTELY,
            jobLink: jobLink
        };
        scrapedAds.push(newAd);
    }
}

export default async function scrapeAds(): Promise<JobAd[]> {
    const browser = await Browser.run();
    const url = `${Constants.WE_WORK_REMOTELY_URL}/remote-jobs/`;
    let page = await Browser.openPage(browser, url);

    // scrape directly from the main page those who do not have .view-all. Otherwise access the separate urls and scrape from there
    const showAllJobsUrls: string[] = [];
    const jobSectionElements = await page.$$(Constants.WE_WORK_REMOTELY_JOB_SECTION_SELECTOR);
    const sectionsToBeScrapedFromMain = [];
    let jobUrlElement = null;
    let newUrl: string | null = null;
    for (let i = 0; i < jobSectionElements.length; i++) {
        jobUrlElement = await jobSectionElements[i].$(Constants.WE_WORK_REMOTELY_VIEW_ALL_JOBS_SELECTOR);
        if (jobUrlElement === null) {
            sectionsToBeScrapedFromMain.push(i);
            continue;
        }
        newUrl = Constants.WE_WORK_REMOTELY_URL + await page.evaluate((el, selector) => el.getAttribute(selector), jobUrlElement, Constants.HREF_SELECTOR);
        showAllJobsUrls.push(newUrl.trim());
    }
    console.log(showAllJobsUrls.length + " additional job pages will be scraped.");     // scraping the pages other than the main one (the ones with higher number of ads)

    // scraping the main page
    const scrapedAds: JobAd[] = [];
    const allJobSections = await page.$$(Constants.WE_WORK_REMOTELY_JOB_SECTION_SELECTOR);

    for (let i = 0; i < sectionsToBeScrapedFromMain.length; i++) {
        // let jobSectionFromMainPage = await page.$(`.jobs-container > .jobs:nth-child(${sectionsToBeScrapedFromMain[i].toString()})`); //   > article > ul
        const jobAdElements = await allJobSections[sectionsToBeScrapedFromMain[i]].$$(Constants.WE_WORK_REMOTELY_JOBLINKS_SELECTOR);
        await storeLinksInScrapedAds(jobAdElements, page, scrapedAds);
        
    }
    console.log(scrapedAds.length + " jobs have been found on the main page");

    console.log("starting to scrape separate pages");
    for (let i = 0; i < showAllJobsUrls.length; i++) {
        page = await Browser.openPage(browser, showAllJobsUrls[i]);

        const jobAdElements = await page.$$(Constants.WE_WORK_REMOTELY_JOBLINKS_SELECTOR_TWO); // not the first and the last one
        jobAdElements.shift();
        jobAdElements.pop();
        console.log(jobAdElements.length + ' jobs found on the page ' + showAllJobsUrls[i]);
        await storeLinksInScrapedAds(jobAdElements, page, scrapedAds);
    }

    console.log(scrapedAds.length + " jobs have been scraped in total.");

    await Browser.close(browser);
    console.log(scrapedAds[0]);
    return scrapedAds;
}
