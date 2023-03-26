import express from 'express';
import scraperService from '../serviceLayer/jobAdScraperService.js';
import * as scrapers from '../serviceLayer/jobAdScrapers/index.js';
import Constants from '../constants.js';
import RequestValidator from '../requestValidator.js';

export default class AdRouter {
    static router;

    static openRoutes() {
        AdRouter.router = express.Router();
        
         // TODO: in progress
        // AdRouter.router.post('/scrape-eures-ads', (req, res) => {
        //     scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scrapers.eu).then(responseObj => {
        //         res.status(responseObj.statusCode).json(responseObj.message);
        //     });
        // });

        AdRouter.router.post('/scrape-adzuna-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeAdzunaAds);
            }
        });

        AdRouter.router.post('/scrape-arbeitnow-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeArbeitNowAds);
            }
        });

        AdRouter.router.post('/scrape-careerbuilder-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)
                || !RequestValidator.validateIfBoolean(req.body.workFromHome)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds, req.body.workFromHome], scrapers.scrapeCareerBuilderAds);
            }
        });

        AdRouter.router.post('/scrape-careerjet-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)
                || !RequestValidator.validateLocation(req.body.location)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds, req.body.location], scrapers.scrapeCareerJetAds);
            }
        });

        AdRouter.router.post('/scrape-cvlibrary-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeCvLibraryAds);
            }
        });

        AdRouter.router.post('/scrape-eurojobs-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeEuroJobsAds);    
            }
        });

        AdRouter.router.post('/scrape-eurojobsites-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateFieldOfWork(req.body.fieldOfWork)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.fieldOfWork], scrapers.scrapeEuroJobSitesAds);
            }
        });

        AdRouter.router.post('/scrape-graduateland-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeGraduatelandAds);
            }
        });

        AdRouter.router.post('/scrape-indeed-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)
                || !RequestValidator.validateLocation(req.body.location)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeBorrowedIndeedAds);    // , req.body.location
            }
        });

        AdRouter.router.post('/scrape-jobfluent-ads', (req, res) => {
            if (!RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.numberOfAds], scrapers.scrapeJobFluentAds);
            }
        });

        AdRouter.router.post('/scrape-jobsinnetwork-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeJobsInNetworkAds);
            }
        });
        
        AdRouter.router.post('/scrape-linkedin-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)
                || !RequestValidator.validateLocation(req.body.location)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds, req.body.location], scrapers.scrapeLinkedInAds);
            }
        });
        
        AdRouter.router.post('/scrape-nofluffjobs-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeNoFluffJobsAds);
            }
        });

        AdRouter.router.post('/scrape-qreer-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeQreerAds);
            }
        });

        AdRouter.router.post('/scrape-simplyhired-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)
                || !RequestValidator.validateLocation(req.body.location)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds, req.body.location], scrapers.scrapeSimplyHiredAds);
            }
        });

        AdRouter.router.post('/scrape-snaphunt-ads', (req, res) => {
            if (!RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.numberOfAds], scrapers.scrapeSnaphuntAds);
            }
        });
        
        AdRouter.router.post('/scrape-tyba-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeTybaAds);
            }
        });
        
        AdRouter.router.get('/scrape-weworkremotely-ads', (req, res) => {
            scrapeAndRespond(res, [], scrapers.scrapeWeWorkRemotelyAds);
        });
        
        return AdRouter.router;
    }
}

// TODO: move these functions within the router class
function scrapeAndRespond(res, args, scraper){
    scraperService.scrape(args, scraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
}

function respondBadRequest(res) {
    res.status(Constants.HTTP_BAD_REQUEST).json({ message: Constants.BAD_REQUEST_MESSAGE});
}
