import dbSession from '../../database/db';
import { JobAd } from '../../dataLayer/models/jobAd';

async function storeAds(scrapedAds: JobAd[]) {
    const db = await dbSession.connectToDB();

    let queryValues = 'VALUES ';
    scrapedAds.forEach((ad: JobAd) => {  
        queryValues += `("${ad.createdDate}","${ad.updatedDate}","${ad.source}","${ad.jobLink}"),`;
    });
    queryValues = queryValues.slice(0, -1);

    console.log("about to query the database")
    try {
        await db.run(`INSERT INTO job_ads (created_at,updated_at,source,job_link)
            ${queryValues};`
        );
    } catch (exception) {
        console.log(exception);
        throw 'An exception occurred while inserting scraped ads into the DB!';
    } finally {
        await dbSession.closeDB(db);
    }
}

// function updateAdsWithDetails(adsToUpdate) {
// TODO: implement this
// }

export default {
    storeAds: storeAds,
    // updateAdsWithDetails: updateAdsWithDetails
}
