const puppeteer = require('puppeteer');

async function runBrowser() {
    const browser = await puppeteer.launch();
    return browser;
}

async function closeBrowser(browser) {
    await browser.close();
}

async function openPage(browser, url) {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({width: 1080, height: 1024});

    return page;
}

async function getDataFrom(page, selector) {
    await page.waitForSelector(selector);
    const dataElement = await page.$(selector);
    const data = await dataElement.evaluate(el => el.textContent);
    await dataElement.dispose();

    return data;
}

module.exports = {
    runBrowser: runBrowser,
    closeBrowser: closeBrowser,
    openPage: openPage,
    getDataFrom: getDataFrom
}
