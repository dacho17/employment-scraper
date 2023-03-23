import puppeteer from 'puppeteer';

export default class Browser {
    browser: any | null;
    page: any | null;

    async run(): Promise<any> {
        this.browser = await puppeteer.launch();
        this.page = null;   // no page openned at the beginning
        
        return this.browser;
    }

    async close(): Promise<void> {
        await this.browser.close();
        this.browser = null;
    }

    async openPage(url: string): Promise<void> {
        this.page = await this.browser.newPage();
        await this.page.goto(url);
        await this.page.setViewport({width: 1080, height: 1024});
    }

    async getDataFrom(selector: string): Promise<string | null> {
        await this.page.waitForSelector(selector);
        const dataElement = await this.page.$(selector);
        const data = await dataElement.evaluate(el => el.textContent);
        await dataElement.dispose();
    
        return data;
    }

}
