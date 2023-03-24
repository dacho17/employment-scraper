import Browser from "../../../browserAPI";
import Constants from "../../../constants";
import { AdSource } from "../../../dataLayer/enums/adSource";
import { AdScrapeTracker } from "../../../dataLayer/models/adScrapeTracker";
import { AdScrapeUrlParams } from "../../../dataLayer/models/adScrapeUrlParams";
import { JobAd } from "../../../dataLayer/models/jobAd";
import Utils from "../../../utils/utils";
import ScraperHelper from "./scraperHelper";

function getSiteData(urlParams: AdScrapeUrlParams, scrapeTracker: AdScrapeTracker, adSource: AdSource) {
    switch (adSource) {
        case AdSource.ADZUNA:
            scrapeTracker.url = `https://www.adzuna.com/search?q=${urlParams.jobTitle}&p=${scrapeTracker.currentPage}`;
            return Constants.ADZUNA_JOBLINKS_SELECTOR;
        case AdSource.ARBEIT_NOW:
            scrapeTracker.url = `https://www.arbeitnow.com/?search=${urlParams.jobTitle}&page=${scrapeTracker.currentPage}`
            return Constants.ARBEITNOW_JOB_ADS;
        case AdSource.CAREER_JET:
            scrapeTracker.url = `${Constants.CAREER_JET_URL}/search/jobs?s=${urlParams.jobTitle}&l=${urlParams.location}&p=${scrapeTracker.currentPage}`;
            return Constants.CAREER_JET_JOBLINKS_SELECTOR;
        case AdSource.CV_LIBRARY:
            scrapeTracker.url = `${Constants.CV_LIBRARY_URL}/${urlParams.jobTitle}?&page=${scrapeTracker.currentPage}`;
            return Constants.CV_LIBRARY_JOBLINKS_SELECTOR;
       case AdSource.EURO_JOBS:
            scrapeTracker.url = `https://eurojobs.com/search-results-jobs/?action=search&listing_type%5Bequal%5D=Job&keywords%5Ball_words%5D=${urlParams.jobTitle}&page=${scrapeTracker.currentPage}&view=list`;
            return Constants.EURO_JOBS_JOBLINKS_SELECTOR;
        case AdSource.GRADUATELAND:
            scrapeTracker.url = `${Constants.GRADUATELAND_URL}/en/jobs?keyword=${urlParams.jobTitle}&limit=10&offset=${scrapeTracker.nOfScrapedAds}`
            return Constants.GRADUATELAND_JOBLINKS_SELECTOR;
        case AdSource.JOB_FLUENT:
            scrapeTracker.url = `${Constants.JOB_FLUENT_URL}/jobs-remote?page=${scrapeTracker.currentPage}`;
            return Constants.JOB_FLUENT_JOBLINKS_SELECTOR;
        case AdSource.NO_FLUFF_JOBS:
            scrapeTracker.url = `${Constants.NO_FLUFF_JOBS_URL}/${urlParams.jobTitle}?page=${scrapeTracker.currentPage}`;
            return Constants.NO_FLUFF_JOBS_JOBLINKS_SELECTOR;
        case AdSource.QREER:
            scrapeTracker.url = `${Constants.QREER_URL}/engineering-jobs/keyword:${urlParams.jobTitle}/page:${scrapeTracker.currentPage}`;
            return Constants.QREER_JOBLINKS_SELECTOR;
        case AdSource.SIMPLY_HIRED:
            scrapeTracker.url = `${Constants.SIMPLY_HIRED_URL}/search?q=${urlParams.jobTitle}&l=${urlParams.location}`;
            return Constants.SIMPLY_HIRED_JOBLINKS_SELECTOR;
        case AdSource.TYBA:
            scrapeTracker.url = `${Constants.TYBA_URL}/jobs?keyword=${urlParams.jobTitle}&limit=10&offset=${scrapeTracker.nOfScrapedAds}`;
            return Constants.TYBA_JOBLINKS_SELECTOR;
        default:
            throw 'AdSource not recognized';
    }
}

function formatJobLink(jobLink: string, adSource: AdSource) {
    switch(adSource) {
        case AdSource.CAREER_JET:
            return Constants.CAREER_JET_URL + jobLink.trim();
        case AdSource.CV_LIBRARY:
            return Constants.CV_LIBRARY_URL + jobLink.trim();
        case AdSource.GRADUATELAND:
            return Constants.GRADUATELAND_URL + jobLink.trim();
        case AdSource.JOB_FLUENT:
            return Constants.JOB_FLUENT_URL + jobLink.trim();
        case AdSource.NO_FLUFF_JOBS:
            return Constants.NO_FLUFF_JOBS_URL + jobLink.trim();
        case AdSource.QREER:
            return Constants.QREER_URL + jobLink.trim();
        case AdSource.SIMPLY_HIRED:
            return Constants.SIMPLY_HIRED_URL + jobLink.trim();
        case AdSource.TYBA:
            return Constants.TYBA_URL + jobLink.trim();
        default:    // adzuna, arbeitNow, cvLibrary, euroJobs,
            return jobLink.trim();
    }
}

export default async function scrapeAdsGeneric(urlParams: AdScrapeUrlParams, adSource: AdSource): Promise<JobAd[]> {
    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    const browser = await Browser.run();

    while (scrapeTracker.nOfScrapedAds < urlParams.reqNofAds) {
        const selector = getSiteData(urlParams, scrapeTracker, adSource);
        let page = await Browser.openPage(browser, scrapeTracker.url);

        console.log(await page.content());
        
        const jobAdElements = await page.$$(selector);
        for (let j = 0; j < jobAdElements.length; j++) {
            let jobLink = await page.evaluate((el, selector) => el.getAttribute(selector), jobAdElements[j], Constants.HREF_SELECTOR);
            jobLink = formatJobLink(jobLink, adSource);

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            const newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: adSource,
                jobLink: jobLink
            }
            scrapeTracker.scrapedAds.push(newAd);
        }

        if (!jobAdElements || jobAdElements.length == 0) break; 
        scrapeTracker.currentPage += 1;
        scrapeTracker.nOfScrapedAds += jobAdElements.length;

        if (adSource === AdSource.SIMPLY_HIRED) {
            const navigationButtons = await page.$$(Constants.SIMPLY_HIRED_NAVIGATION_BUTTONS_SELECTOR);
            for (let i = 0; i < navigationButtons.length; i++) {
                const [candidateButtonPageContent, candidateUrl] = await page.evaluate((el, selectorOne, selectorTwo) => 
                    [el.getAttribute(selectorOne), el.getAttribute(selectorTwo)],
                        navigationButtons[i], Constants.ARIALABEL_SELECTOR, Constants.HREF_SELECTOR);
                const pageElementSegments = candidateButtonPageContent.split(Constants.WHITESPACE);
                if (isNaN(parseInt(pageElementSegments[1]))) continue;
                if (parseInt(pageElementSegments[1]) == scrapeTracker.currentPage) {
                    scrapeTracker.url = candidateUrl;
                    break;
                }
            }
            page = await Browser.openPage(browser, scrapeTracker.url);
        }
    }

    console.log(scrapeTracker.scrapedAds.length + " ads have been scraped in total.");
    console.log(scrapeTracker.scrapedAds[0]);
    await Browser.close(browser);
    return scrapeTracker.scrapedAds;
}
