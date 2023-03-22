const { connectToDB, closeDB } = require("../database/db");

function storeAds(scrapedAds) {
    const db = connectToDB();

    let queryValues = 'VALUES ';
    scrapedAds.forEach(ad => {  
        queryValues += '(' + `"${ad.createdDate}","${ad.updatedDate}","${ad.source}","${ad.jobLink}","${ad.areDetailsScraped}",
            "${ad.detailsScrapedDate}","${ad.jobTitle}","${ad.postingDate}","${ad.companyName}","${ad.companyLocation}",
            "${ad.companyLink}","${ad.workLocation}","${ad.jobEngagement}","${ad.salaryInfo}","${ad.nOfApplicants}",
            "${ad.adContent}","${ad.additionalData}"),`;
    });
    queryValues = queryValues.slice(0, -1);

    console.log("about to query the database")
    try {
        db.run(`INSERT INTO job_ads (created_at,updated_at,source,job_link,are_details_scraped,details_scraped_date,job_title,
            posting_date,company_name,company_location,company_link,work_location,job_engagement,salary_info,n_of_applicants,
            ad_content,additional_data)
            ${queryValues};`
        );
    } catch (exception) {
        console.log(exception);
        throw 'An exception occurred while inserting scraped ads into the DB!';
    } finally {
        closeDB(db);
    }
}

function updateAdsWithDetails(adsToUpdate) {
    // TODO: implement this
}

module.exports = {
    storeAdsToDB: storeAds,
    updateAdsWithDetails: updateAdsWithDetails
}
