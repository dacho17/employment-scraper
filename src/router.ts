import express from 'express';
import scraperService from './serviceLayer/scraperService';
import * as scrapers from './serviceLayer/scrapers';

export default class AppRouter {
    static router;

    static openRoutes() {
        AppRouter.router = express.Router();

        AppRouter.router.post('/scrape-linkedin-ads', (req, res) => {
            scraperService.scrape([req.body.jobTitle, req.body.location, req.body.nOfAds], scrapers.scrapeLinkedInAds)
            .then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        // TODO: to be implemented
        // AppRouter.router.get('/scrape-linkedin-details', (req, res) => {
        //     scraperService.scrape([], scrapers.likne).then(responseObj => {
        //         res.status(responseObj.statusCode).json(responseObj.message);
        //     });
        // })

        // TODO: the scraper is in process
        // AppRouter.router.post('/scrape-indeed', (req, res) => {
        //     scraperService.scrape([req.body.jobTitle], scrapers.)
        //     .then(responseObj => {
        //         res.status(responseObj.statusCode).json(responseObj.message);
        //     });
        // });

         // TODO: in progress
        // AppRouter.router.post('/scrape-eures-ads', (req, res) => {
        //     scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scrapers.eu).then(responseObj => {
        //         res.status(responseObj.statusCode).json(responseObj.message);
        //     });
        // });
        
        AppRouter.router.post('/scrape-careerbuilder', (req, res) => {
            scraperService.scrape([req.body.workFromHome, req.body.jobTitle, req.body.nOfAds], scrapers.scrapeCareerBuilderAds)
            .then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-snaphunt-both', (req, res) => {
            scraperService.scrape([req.body.nOfAds], scrapers.scrapeSnaphuntAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-simplyhired-both', (req, res) => {
            scraperService.scrape([req.body.nOfAds, req.body.jobTitle, req.body.location], scrapers.scrapeSimplyHiredAds)
            .then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-careerjet-both', (req, res) => {
            scraperService.scrape([req.body.nOfAds, req.body.jobTitle, req.body.location], scrapers.scrapeCareerJetAds)
            .then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-jobfluent-both', (req, res) => {
            scraperService.scrape([req.body.nOfAds], scrapers.scrapeJobFluentAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.get('/scrape-weworkremotely-ads', (req, res) => {
            scraperService.scrape([], scrapers.scrapeWeWorkRemotelyAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-adzuna-ads', (req, res) => {
            scraperService.scrape([req.body.jobTitle, req.body.nOfAds], scrapers.scrapeAdzunaAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
            
        });
        
        AppRouter.router.post('/scrape-tyba-ads', (req, res) => {
            scraperService.scrape([req.body.jobTitle, req.body.nOfAds], scrapers.scrapeTybaAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-nofluffjobs-ads', (req, res) => {
            scraperService.scrape([req.body.jobTitle, req.body.nOfAds], scrapers.scrapeNoFluffJobsAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-jobsinnetwork-ads', (req, res) => {
            scraperService.scrape([req.body.jobTitle, req.body.nOfAds], scrapers.scrapeJobsInNetworkAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-qreer-ads', (req, res) => {
            scraperService.scrape([req.body.jobTitle, req.body.nOfAds], scrapers.scrapeQreerAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-arbeitnow-ads', (req, res) => {
            scraperService.scrape([req.body.jobTitle, req.body.nOfAds], scrapers.scrapeArbeitNowAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-cvlibrary-ads', (req, res) => {
            scraperService.scrape([req.body.jobTitle, req.body.nOfAds], scrapers.scrapeCvLibraryAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });
        
        AppRouter.router.post('/scrape-eurojobsites-ads', (req, res) => {
            scraperService.scrape([req.body.jobTitle, req.body.field], scrapers.scrapeEuroEngineerAds).then(responseObj => {
                res.status(responseObj.statusCode).json(responseObj.message);
            });
        });

        return AppRouter.router;
    }
}


