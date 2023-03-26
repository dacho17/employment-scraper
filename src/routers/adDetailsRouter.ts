import express from 'express';
import * as scrapers from '../serviceLayer/jobDetailsScrapers/index.js';
import jobDetailsScraperService from '../serviceLayer/jobDetailsScraperService.js';

export default class AdDetailsRouter {
    static router;

    static openRoutes() {
        AdDetailsRouter.router = express.Router();

        AdDetailsRouter.router.get('/scrape-adzuna-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeAdzunaDetails);
        });

        AdDetailsRouter.router.get('/scrape-arbeit-now-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeArbeitNowDetails);
        });

        AdDetailsRouter.router.get('/scrape-career-builder-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeCareerBuilderDetails);
        });

        AdDetailsRouter.router.get('/scrape-career-jet-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeCareerJetDetails);
        });

        AdDetailsRouter.router.get('/scrape-cv-library-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeCvLibraryDetails);
        });

        AdDetailsRouter.router.get('/scrape-euro-jobs-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeEuroJobsDetails);
        });

        AdDetailsRouter.router.get('/scrape-euro-job-sites-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeEuroJobSitesDetails);
        });

        AdDetailsRouter.router.get('/scrape-graduateland-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeGraduatelandDetails);
        });

        AdDetailsRouter.router.get('/scrape-indeed-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeIndeedDetails);
        });

        AdDetailsRouter.router.get('/scrape-job-fluent-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeJobFluentDetails);
        });

        AdDetailsRouter.router.get('/scrape-jobs-in-network-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeJobsInNetworkDetails);
        });

        AdDetailsRouter.router.get('/scrape-linkedin-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeLinkedinDetails);
        });

        AdDetailsRouter.router.get('/scrape-no-fluff-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeNoFluffDetails);
        });

        AdDetailsRouter.router.get('/scrape-qreer-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeQreerDetails);
        });

        AdDetailsRouter.router.get('/scrape-simply-hired-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeSimplyHiredDetails);
        });

        AdDetailsRouter.router.get('/scrape-snaphunt-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeSnaphuntDetails);
        });

        AdDetailsRouter.router.get('/scrape-tyba-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeTybaDetails);
        });

        AdDetailsRouter.router.get('/scrape-we-work-remotely-details', (req, res) => {
            AdDetailsRouter.scrapeAndRespond(res, scrapers.scrapeWeWorkRemotelyDetails);
        });

        return AdDetailsRouter.router;
    }

    static scrapeAndRespond(res, scraper){
        jobDetailsScraperService.scrape(scraper).then(responseObj => {
            res.status(200).json(responseObj);  // TODO: implement error handling
        });
    }
}
