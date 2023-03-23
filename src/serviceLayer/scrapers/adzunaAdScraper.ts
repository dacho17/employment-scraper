import Browser from '../../browserAPI';
import Constants from '../../constants';
import { AdSource } from '../../dataLayer/enums/adSource';
import { JobAd } from '../../dataLayer/models/jobAd';
import Utils from '../../utils/utils';

export default async function scrapeAds(requestedJobTitle: string, nOfAdsToBeScraped: number): Promise<JobAd[]> {
    const formattedJobTitle = requestedJobTitle.trim().replace(Constants.WHITESPACE, Constants.WHITESPACE_URL_ENCODING);
    let currentPage = 1;
    
    const browser = await (new Browser()).run();

    const scrapedAds: JobAd[] = [];
    let nOfScrapedAds = 0;
    let url: string | null = null;
    while (nOfScrapedAds <= nOfAdsToBeScraped) {
        url = `https://www.adzuna.com/search?q=${formattedJobTitle}&p=${currentPage}`;
        await browser.openPage(url);

        const jobAdElements = await browser.page.$$(Constants.ADZUNA_SELECTOR_JOB_ADS);
        console.log("about to scrape " + url + ". " + jobAdElements.length + " job ads have been detected on the page");
        let jobLink: string | null;
        const newAd: JobAd = {
            createdDate: null,
            updatedDate: null,
            source: null,
            jobLink: null
        };
        for (let j = 0; j < jobAdElements.length; j++) {
            jobLink = await jobAdElements[j].$eval(Constants.ADZUNA_SELECTOR_JOB_LINK[0], el => el.getAttribute(Constants.ADZUNA_SELECTOR_JOB_LINK[1]));
    
            const currentTimestap = Utils.transformToTimestamp((new Date(Date.now())).toString());
            newAd.createdDate = currentTimestap;
            newAd.updatedDate = currentTimestap;
            newAd.source = AdSource.ADZUNA;
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
