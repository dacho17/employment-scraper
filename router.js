const express = require('express');
const router = express.Router();
let scraperIndex = require('./scrapers/scraperIndex')

// TODO: larger change - standardize numberOfAds and numberOfPages. Pick one and stick to it
// TODO: diferentiate between detail and ad scraping. Make it two different methods in the service

router.post('/scrape-linkedin-ads', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle, req.body.location, req.body.nOfAds], scraperIndex.lnAdScraper)
    .then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.get('/scrape-linkedin-details', (req, res) => {
    scraperService.doAscrape([], scraperIndex.lnDetailedScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
})

router.post('/scrape-indeed', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle], scraperIndex.indeedScraper)
    .then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-careerbuilder', (req, res) => {
    scraperService.doAscrape([req.body.workFromHome, req.body.jobTitle, req.body.nOfAds], scraperIndex.careerBuilderAdScraper)
    .then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-snaphunt-both', (req, res) => {
    scraperService.doAscrape([req.body.nOfAds], scraperIndex.snaphuntDetailedScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-simplyhired-both', (req, res) => {
    scraperService.doAscrape([req.body.nOfPages, req.body.jobTitle, req.body.location], scraperIndex.simplyHiredAdScraper)
    .then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-careerjet-both', (req, res) => {
    scraperService.doAscrape([req.body.nOfPages, req.body.jobTitle, req.body.location], scraperIndex.careerJetScraper)
    .then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-jobfluent-both', (req, res) => {
    scraperService.doAscrape([req.body.nOfPages], scraperIndex.jobFluentAdScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.get('/scrape-weworkremotely-ads', (req, res) => {
    scraperService.doAscrape([], scraperIndex.wwrAdScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-adzuna-ads', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scraperIndex.adzunaAdScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
    
});

router.post('/scrape-tyba-ads', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scraperIndex.tybaAdScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-nofluffjobs-ads', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scraperIndex.noFluffJobsAdScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-jobsinnetwork-ads', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scraperIndex.jobsInNetworkAdScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-qreer-ads', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scraperIndex.qreerAdScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-arbeitnow-ads', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scraperIndex.arbeitNowAdScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-cvlibrary-ads', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scraperIndex.cvLibraryAdScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-eures-ads', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scraperIndex.euresAdScraper).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-euroengineer-ads', (req, res) => {
    scraperService.doAscrape([req.body.jobTitle, req.body.nOfAds], scraperIndex.euroEngineerJobs).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

module.exports = router;
