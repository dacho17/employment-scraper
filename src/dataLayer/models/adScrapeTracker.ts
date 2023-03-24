import { JobAd } from "./jobAd";

export class AdScrapeTracker {
    nOfScrapedAds: number;
    scrapedAds: JobAd[];
    url?: string;
    // browser: any;
    // pageObject: any;
    currentPage: number;
}
