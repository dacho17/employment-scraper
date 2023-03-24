import puppeteer from 'puppeteer';

export default class Browser {
    // browser: any | null;
    // page: any | null;

    static async run(): Promise<any> {
        // this.browser = ;
        // this.page = null;   // no page openned at the beginning
        
        return await puppeteer.launch();
    }

    static async close(browser): Promise<void> {
        await browser.close();
    }

    static async openPage(browser, url: string): Promise<any> {
        const page = await browser.newPage();
        await page.goto(url);
        await page.setViewport({width: 1080, height: 1024});
        return page;
    }

    static async getDataFrom(page, selector: string): Promise<string | null> {
        await page.waitForSelector(selector);
        const dataElement = await page.$(selector);
        const data = await dataElement.evaluate(el => el.textContent);
        await dataElement.dispose();
    
        return data;
    }
}
