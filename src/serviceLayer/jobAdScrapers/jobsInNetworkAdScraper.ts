import Browser from '../../browserAPI.js';
import ScraperHelper from './common/scraperHelper.js';
import Constants from '../../constants.js';
import { AdSource } from '../../dataLayer/enums/adSource.js';
import { JobAd } from '../../dataLayer/models/jobAd.js';
import Utils from '../../utils/utils.js';

// NOTE: this method is tricky, make sure it works so we do not produce faulty links
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

export default async function scrapeAds(reqJobTitle: string, reqNofAds: number): Promise<JobAd[]> {
    const formattedJobTitle = reqJobTitle.replace(Constants.WHITESPACE, Constants.WHITESPACE_URL_ENCODING);

    const scrapeTracker = ScraperHelper.scrapeSetup(null, 1);
    const browser = await Browser.run();
    while (scrapeTracker.nOfScrapedAds < reqNofAds) {
        scrapeTracker.url = `${Constants.JOBS_IN_NETWORK_URL}/?query=${formattedJobTitle}?page=${scrapeTracker.currentPage}`;
        const page = await Browser.openPage(browser, scrapeTracker.url);

        await resolveCookieWindowIfPresent(page);   // check if there is a button to confirm
        
        const jobTitles = await page.$$(Constants.JOBS_IN_NETWORK_JOBTITLE_SELECTOR);
        const jobIds = await page.$$(Constants.JOBS_IN_NETWORK_JOBID_SELECTOR);
        console.log("about to scrape " + scrapeTracker.url + ". " + jobTitles.length + " job ads have been detected on the page");
        for (let i = 0; i < jobTitles.length; i++) {
            const jobTitle = await page.evaluate(el => el.innerText, jobTitles[i]);
            const jobId = await page.evaluate((el, selector) => el.getAttribute(selector), jobIds[i], Constants.ID_SELECTOR);
            const jobLink = `${Constants.JOBS_IN_NETWORK_URL}/jobs/${formatJobTitleForJobLink(jobTitle.trim()) + jobId.trim()}`;

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            const newAd: JobAd = {
                createdDate: currentTimestap,
                updatedDate: currentTimestap,
                source: AdSource.JOBS_IN_NETWORK,
                jobLink: jobLink
            };
            scrapeTracker.scrapedAds.push(newAd);
        }
    
        if (!jobTitles || jobTitles.length == 0) break; 
        scrapeTracker.currentPage += 1;
        scrapeTracker.nOfScrapedAds += jobTitles.length;
    }

    console.log(scrapeTracker.scrapedAds.length + " ads have been scraped in total.");

    await Browser.close(browser);
    return scrapeTracker.scrapedAds;
}
