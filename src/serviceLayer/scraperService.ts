import adRepository from "../dataLayer/repositories/adRepository";

async function scrape(params, scraperFunc) {
    let scrapedAds = null
    try {
       scrapedAds = await scraperFunc(...params);
    } catch (exception) {
      console.log(exception.message);
      return {
          statusCode: 500,
          message: exception.message
      }
    }

    console.log(scrapedAds[0]);
    try {
        await adRepository.storeAds(scrapedAds);
        return {
            statusCode: 200,
            message: 'Ads scraped and stored into the database successfully!'
        }
      } catch (exception) {
        return {
            statusCode: 500,
            message: exception.message
        }
    }
}

export default {
    scrape: scrape
}
