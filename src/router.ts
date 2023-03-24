import express from 'express';
import scraperService from './serviceLayer/scraperService.js';
import * as scrapers from './serviceLayer/scrapers/index.js';
import Constants from './constants.js';
import RequestValidator from './requestValidator.js';

export default class AppRouter {
    static router;

    static openRoutes() {
        AppRouter.router = express.Router();
        
        // TODO: to be implemented
        // AppRouter.router.get('/scrape-linkedin-details', (req, res) => {
        //     scraperService.scrape([], scrapers.likne).then(responseObj => {
        //         res.status(responseObj.statusCode).json(responseObj.message);
        //     });
        // })



         // TODO: in progress
        // AppRouter.router.post('/scrape-eures-ads', (req, res) => {
        //     scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scrapers.eu).then(responseObj => {
        //         res.status(responseObj.statusCode).json(responseObj.message);
        //     });
        // });

        AppRouter.router.post('/scrape-adzuna-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeAdzunaAds);
            }
        });

        AppRouter.router.post('/scrape-arbeitnow-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeArbeitNowAds);
            }
        });

        AppRouter.router.post('/scrape-careerbuilder-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)
                || !RequestValidator.validateIfBoolean(req.body.workFromHome)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds, req.body.workFromHome], scrapers.scrapeCareerBuilderAds);
            }
        });

        AppRouter.router.post('/scrape-careerjet-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)
                || !RequestValidator.validateLocation(req.body.location)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds, req.body.location], scrapers.scrapeCareerJetAds);
            }
        });

        AppRouter.router.post('/scrape-cvlibrary-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeCvLibraryAds);
            }
        });

        AppRouter.router.post('/scrape-eurojobs-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeEuroJobsAds);    
            }
        });

        AppRouter.router.post('/scrape-eurojobsites-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateFieldOfWork(req.body.fieldOfWork)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.fieldOfWork], scrapers.scrapeEuroJobSitesAds);
            }
        });

        AppRouter.router.post('/scrape-indeed-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)
                || !RequestValidator.validateLocation(req.body.location)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeBorrowedIndeedAds);    // , req.body.location
            }
        });

        AppRouter.router.post('/scrape-jobfluent-ads', (req, res) => {
            if (!RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.numberOfAds], scrapers.scrapeJobFluentAds);
            }
        });

        AppRouter.router.post('/scrape-jobsinnetwork-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeJobsInNetworkAds);
            }
        });
        
        AppRouter.router.post('/scrape-linkedin-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)
                || !RequestValidator.validateLocation(req.body.location)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds, req.body.location], scrapers.scrapeLinkedInAds);
            }
        });
        
        AppRouter.router.post('/scrape-nofluffjobs-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeNoFluffJobsAds);
            }
        });

        AppRouter.router.post('/scrape-qreer-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeQreerAds);
            }
        });

        AppRouter.router.post('/scrape-simplyhired-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)
                || !RequestValidator.validateLocation(req.body.location)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds, req.body.location], scrapers.scrapeSimplyHiredAds);
            }
        });

        AppRouter.router.post('/scrape-snaphunt-ads', (req, res) => {
            if (!RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.numberOfAds], scrapers.scrapeSnaphuntAds);
            }
        });
        
        AppRouter.router.post('/scrape-tyba-ads', (req, res) => {
            if (!RequestValidator.validateJobTitle(req.body.jobTitle) || !RequestValidator.validateNofAds(req.body.numberOfAds)) {
                respondBadRequest(res);
            } else {
                scrapeAndRespond(res, [req.body.jobTitle, req.body.numberOfAds], scrapers.scrapeTybaAds);
            }
        });
        
        AppRouter.router.get('/scrape-weworkremotely-ads', (req, res) => {
            scrapeAndRespond(res, [], scrapers.scrapeWeWorkRemotelyAds);
        });
        
        return AppRouter.router;
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
