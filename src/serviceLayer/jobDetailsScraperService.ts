import { JobDetails } from "../dataLayer/models/jobDetails";

async function scrape(scraperFunc) {
    // TODO: fetch the list of entries for which scrape needs to be done
    
    // if no entries have been found return from the method
    // if (scrapedAds?.length == 0) {
    //     return {
    //         statusCode: 200,
    //         message: Constants.NO_DETAILS_FOUND_TO_BE_SCRAPED_MESSAGE
    //     }
    // }
    
    
    // TODO: validate urls before accessing them? 



    let scrapedJobDetails: JobDetails[] | null = null;
    try {
        scrapedJobDetails = await scraperFunc();
    } catch (exception) {
      console.log(exception.message);
      return {
          statusCode: 500,
          message: exception.message
      }
    }

    // TODO: store the scraped jobDetails to the databse

    return scrapedJobDetails;
}

export default {
    scrape: scrape
}
