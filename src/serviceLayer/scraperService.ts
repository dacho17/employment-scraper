import Constants from "../constants.js";
import { JobAd } from "../dataLayer/models/jobAd.js";
import adRepository from "../dataLayer/repositories/adRepository.js";

async function scrape(params, scraperFunc) {
    let scrapedAds: JobAd[] | null = null
    try {
       scrapedAds = await scraperFunc(...params);
    } catch (exception) {
      console.log(exception.message);
      return {
          statusCode: 500,
          message: exception.message
      }
    }

    if (scrapedAds?.length == 0) {
        return {
            statusCode: 200,
            message: Constants.NO_ADS_FOUND_TO_BE_SCRAPED_MESSAGE
        }
    }

    try {
        await adRepository.storeAds(scrapedAds);
        return {
            statusCode: 200,
            message: Constants.ADS_SCRAPED_SUCCESSFULLY
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
