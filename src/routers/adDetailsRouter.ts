import express from 'express';
import * as scrapers from '../serviceLayer/jobDetailsScrapers/index.js';
import jobDetailsScraperService from '../serviceLayer/jobDetailsScraperService.js';

export default class AdDetailsRouter {
    static router;

    static openRoutes() {
        AdDetailsRouter.router = express.Router();

        AdDetailsRouter.router.get('/scrape-adzuna-ad-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeAdzunaDetails);
        });

        AdDetailsRouter.router.get('/scrape-arbeit-now-ad-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeArbeitNowDetails);
        });

        AdDetailsRouter.router.get('/scrape-career-builder-ad-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeCareerBuilderDetails);
        });

        AdDetailsRouter.router.get('/scrape-career-jet-ad-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeCareerJetDetails);
        });

        AdDetailsRouter.router.get('/scrape-cv-library-ad-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeCvLibraryDetails);
        });

        AdDetailsRouter.router.get('/scrape-euro-jobs-ad-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeEuroJobsDetails);
        });

        return AdDetailsRouter.router;
    }

    static scrapeAndRespond(res, scraper){
        jobDetailsScraperService.scrape(scraper).then(responseObj => {
            res.status(200).json(responseObj);  // TODO: implement error handling
        });
    }
}
