const express = require('express');
const router = express.Router();

const lnAdScraper = require('./scrapers/LNadScraper');
const lnDetailedScraper = require('./scrapers/LNdetailedScraper');
const indeedScraper = require('./scrapers/indeedScraper');
const careerBuilderAdScraper = require('./scrapers/careerBuilderAdScraper');

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

router.post('/scrape-career-builder', (req, res) => {
    careerBuilderAdScraper.doAscrape(req.body.workFromHome, req.body.jobTitle, req.body.nOfAds).then(responseObj => {
        // res.status(responseObj.statusCode).json(responseObj.message);
        res.status(200).json('zz');
    });
});

module.exports = router;
