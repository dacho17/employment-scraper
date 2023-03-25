import { AdScrapeTracker } from "../../../dataLayer/models/adScrapeTracker";

function scrapeSetup(url: string | null, currentPage: number): AdScrapeTracker {
    const scrapeTracker: AdScrapeTracker = {
        nOfScrapedAds: 0,
        scrapedAds: [],
        url: url,
        currentPage: currentPage
    }

    return scrapeTracker;
}

export default {
    scrapeSetup: scrapeSetup
}
