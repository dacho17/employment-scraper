import Browser from "../../browserAPI";
import Constants from "../../constants";
import { AdSource } from "../../dataLayer/enums/adSource";
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from "../../utils/utils";

// NOTE: this method is tricky, make sure it works so we do not produce faulty links
function formatJobTitleForJobLink(jobTitle: string): string {
    let changedJobTitle = jobTitle.toLowerCase().replace(/[\s+]/g, ' ');
    // changedJobTitle = changedJobTitle.replace(/\s/g, '-');
    changedJobTitle = changedJobTitle.replace(/^[a-z]^[\s]^[\d]/g,'');
    changedJobTitle = changedJobTitle.replace(/[:;()/,\s]+/g, '-');
    changedJobTitle = changedJobTitle.replace(/[-]+/g, '-');
    return changedJobTitle + '/';
}

export default async function scrapeAds(requestedJobTitle: string, nOfAdsToBeScraped: number): Promise<JobAd[]> {
    const formattedJobTitle = requestedJobTitle.replace(Constants.WHITESPACE, Constants.WHITESPACE_URL_ENCODING);
    let currentPage = 1;

    const browser = await (new Browser()).run();
    
    const scrapedAds: JobAd[] = [];
    let nOfScrapedAds = 0;
    let jobAdElements = null;
    let url: string | null = null;
    while (nOfScrapedAds < nOfAdsToBeScraped) {
        url = `https://www.jobsinnetwork.com/?query=${formattedJobTitle}?page=${currentPage}`;
        await browser.openPage(url);

        jobAdElements = await browser.page.$$(Constants.JOBS_IN_NETWORK_JOBITEMS_SELECTOR);
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        let [jobTitle, jobId, jobLink] = [null, null, null];
        const newAd: JobAd = {
            createdDate: null,
            updatedDate: null,
            source: null,
            jobLink: null
        };
        for (let i = 0; i < jobAdElements.length; i++) {
            jobTitle = await jobAdElements[i].$eval(Constants.JOBS_IN_NETWORK_JOBTITLE_SELECTOR, el => el.innerText);

            jobId = await jobAdElements[i].$eval(Constants.JOBS_IN_NETWORK_JOBID_SELECTOR, el => el.getAttribute(Constants.ID_SELECTOR));
            jobLink = 'https://www.jobsinnetwork.com/jobs/' + formatJobTitleForJobLink(jobTitle.trim()) + jobId.trim();

            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            newAd.createdDate = currentTimestap;
            newAd.updatedDate = currentTimestap;
            newAd.source = AdSource.JOBS_IN_NETWORK;
            newAd.jobLink = jobLink;
            scrapedAds.push(newAd);
        }
    
        if (!jobAdElements || jobAdElements.length == 0) break; 
        currentPage += 1;
        nOfScrapedAds += jobAdElements.length;
    }

    console.log(scrapedAds.length + " ads have been scraped in total.");

    await browser.closeBrowser();
    return scrapedAds;
}
