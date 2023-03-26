import Browser from '../../browserAPI.js';
import ScraperHelper from './common/scraperHelper.js';
import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';

// NOTE: this method is tricky, make sure it works so we do not produce faulty links
// jobTitle, companyName, companyLocation, postedDate, 
function formatJobTitleForJobLink(jobTitle: string): string {
    let changedJobTitle = jobTitle.toLowerCase().replace(/[\s+]/g, ' ');
    // changedJobTitle = changedJobTitle.replace(/\s/g, '-');
    changedJobTitle = changedJobTitle.replace(/^[a-z]^[\s]^[\d]/g,'');
    changedJobTitle = changedJobTitle.replace(/[:;()/,\s]+/g, '-');
    changedJobTitle = changedJobTitle.replace(/[-]+/g, '-');
    return changedJobTitle + '/';
}

async function resolveCookieWindowIfPresent(page) {
    const cookieConfirmationButton = await page.$('.popup-modal-button-primary');
    if (cookieConfirmationButton) {
        console.log('button was found, and is to be clicked');
        await cookieConfirmationButton.evaluate(button => button.click());
        await page.waitForTimeout(2000);
        console.log('the button was clicked');
    }
}

// this scraper will probably not have a detailed version due to sites being of different formats.
// TODO: needs to support storing jobDetails and jobDescription which it does not ATM
export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.replace(Constants.WHITESPACE, Constants.WHITESPACE_URL_ENCODING);

    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    const browser = await Browser.run();
    while (scrapeTracker.nOfScrapedAds < reqNofAds) {
        scrapeTracker.url = `${Constants.JOBS_IN_NETWORK_URL}/?query=${formattedJobTitle}?page=${scrapeTracker.currentPage}`;
        const page = await Browser.openPage(browser, scrapeTracker.url);

        await resolveCookieWindowIfPresent(page);   // check if there is a button to confirm
        
        const jobIdElements = await page.$$(Constants.JOBS_IN_NETWORK_JOBID_SELECTOR);
        const jobTitlesElements = await page.$$(Constants.JOBS_IN_NETWORK_JOB_TITLE_SELECTOR);
        const companyNamesElements = await page.$$(Constants.JOBS_IN_NETWORK_COMPANY_NAME_SELECTOR);
        const companyLocationsElements = await page.$$(Constants.JOBS_IN_NETWORK_COMPANY_LOCATION_SELECTOR);
        const postedAgoElements = await page.$$(Constants.JOBS_IN_NETWORK_POSTED_AGO_SELECTOR);
        const jobDetailsElements = await page.$$(Constants.JOBS_IN_NETWORK_JOB_DETAILS_SELECTOR);
        const jobDescriptionElements = await page.$$(Constants.JOBS_IN_NETWORK_JOB_DESCRIPTION_SELECTOR);

        console.log("about to scrape " + scrapeTracker.url + ". " + jobTitlesElements.length + " job ads have been detected on the page");
        for (let i = 0; i < jobTitlesElements.length; i++) {
            const jobTitle = await page.evaluate(el => el.innerText, jobTitlesElements[i]);
            const companyName = await page.evaluate(el => el.innerText, companyNamesElements[i]);
            const companyLocation = await page.evaluate(el => el.innerText, companyLocationsElements[i]);
            const jobDetails = await page.evaluate(el => el.textContent, jobDetailsElements[i]);
            const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElements[i]);
            const jobId = await page.evaluate((el, selector) => el.getAttribute(selector), jobIdElements[i], Constants.ID_SELECTOR);
            const postedAgo = await page.evaluate(el => el.innerText, postedAgoElements[i]);
            const postedDate = Utils.getPostedDate4JobsInNetwork(postedAgo);
            const postedTimestamp = Utils.transformToTimestamp(postedDate.toString());

            const jobLink = `${Constants.JOBS_IN_NETWORK_URL}/jobs/${formatJobTitleForJobLink(jobTitle.trim()) + jobId.trim()}`;

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            const newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: AdSource.JOBS_IN_NETWORK,
                jobLink: jobLink,
                jobTitle: jobTitle.trim(),
                companyName: companyName.trim(),
                companyLocation: companyLocation.trim(),
                postingDate: postedTimestamp,
                // jobDescription: jobDescription.trim(),
                // jobDetails: jobDetails.trim()
            };


            scrapeTracker.scrapedAds.push(newAd);
        }
    
        if (!jobTitlesElements || jobTitlesElements.length == 0) break; 
        scrapeTracker.currentPage += 1;
        scrapeTracker.nOfScrapedAds += jobTitlesElements.length;
    }

    console.log(scrapeTracker.scrapedAds.length + " ads have been scraped in total.");

    await Browser.close(browser);
    return scrapeTracker.scrapedAds;
}
