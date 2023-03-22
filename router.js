const express = require('express');
const router = express.Router();

const lnAdScraper = require('./scrapers/LNadScraper');
const lnDetailedScraper = require('./scrapers/LNdetailedScraper');
const indeedScraper = require('./scrapers/indeedScraper');
const careerBuilderAdScraper = require('./scrapers/careerBuilderAdScraper');
const snaphuntDetailedScraper = require('./scrapers/snaphuntDetailedScraper');
const simplyHiredAdScraper = require('./scrapers/simplyHiredAdScraper');
const careerJetScraper = require('./scrapers/careerJetScraper');
const jobFluentAdScraper = require('./scrapers/jobFluentAdScraper');
const wwrAdScraper = require('./scrapers/wwrAdScraper');
const adzunaAdScraper = require('./scrapers/adzunaAdScraper');
const tybaAdScraper = require('./scrapers/tybaAdScraper');
const noFluffJobsAdScraper = require('./scrapers/noFluffJobsAdScraper');
const jobsInNetworkAdScraper = require('./scrapers/jobsInNetworkAdScraper');
const qreerAdScraper = require('./scrapers/qreerAdScraper');

router.post('/scrape-linkedin-ads', (req, res) => {
    lnAdScraper.doAscrape(req.body.jobTitle, req.body.location, req.body.nOfAds).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.get('/scrape-linkedin-details', (req, res) => {
    lnDetailedScraper.scrapeAdsDetails().then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
})

router.post('/scrape-indeed', (req, res) => {
    console.log(req.body.jobTitle);
    indeedScraper.doAscrape(req.body.jobTitle).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-careerbuilder', (req, res) => {
    careerBuilderAdScraper.doAscrape(req.body.workFromHome, req.body.jobTitle, req.body.nOfAds).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-snaphunt-both', (req, res) => {
    snaphuntDetailedScraper.doAscrape(req.body.nOfAds).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-simplyhired-both', (req, res) => {
    simplyHiredAdScraper.doAscrape(req.body.nOfPages, req.body.jobTitle, req.body.location).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-careerjet-both', (req, res) => {
    careerJetScraper.doAscrape(req.body.nOfPages, req.body.jobTitle, req.body.location).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-jobfluent-both', (req, res) => {
    jobFluentAdScraper.doAscrape(req.body.nOfPages).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.get('/scrape-weworkremotely-ads', (req, res) => {
    wwrAdScraper.doAscrape().then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-adzuna-ads', (req, res) => {
    adzunaAdScraper.doAscrape(req.body.jobTitle, req.body.nOfPages).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-tyba-ads', (req, res) => {
    tybaAdScraper.doAscrape(req.body.jobTitle, req.body.nOfAds).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-nofluffjobs-ads', (req, res) => {
    noFluffJobsAdScraper.doAscrape(req.body.jobTitle, req.body.nOfAds).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-jobsinnetwork-ads', (req, res) => {
    jobsInNetworkAdScraper.doAscrape(req.body.jobTitle, req.body.nOfAds).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

router.post('/scrape-qreer-ads', (req, res) => {
    qreerAdScraper.doAscrape(req.body.jobTitle, req.body.nOfAds).then(responseObj => {
        res.status(responseObj.statusCode).json(responseObj.message);
    });
});

module.exports = router;
