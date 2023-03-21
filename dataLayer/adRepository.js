const { connectToDB, closeDB } = require("../database/db");
const { transformToTimestamp } = require("../utils/utils");

// LN, CB, INDEED
function storeAds(scrapedAds) {
    const db = connectToDB();
    const createdDate = transformToTimestamp(new Date(Date.now()));

    let queryValues = 'VALUES ';
    scrapedAds.forEach(ad => {  
        queryValues += '(' + `"${createdDate}","${createdDate}","${ad.source}","${ad.jobLink}","${ad.jobTitle}",
            "${ad.companyName}","${ad.companyLocation}","${ad.hireType}","${ad.salaryInfo}","${ad.postedDate}"),`;
    });
    queryValues = queryValues.slice(0, -1);

    console.log("about to query the database")
    try {
        db.run(`INSERT INTO job_ads (created_at,updated_at,source,job_link,job_title,company_name,location,hire_type,salary_info,posting_date)
            ${queryValues};`
        );
    } catch (exception) {
        console.log(exception);
        throw exception('An exception occurred while inserting scraped ads into the DB!');
    } finally {
        closeDB(db);
    }
}

function storeAdDetails(scrapedAdDetails) {
    const db = connectToDB();
    const createdDate = transformToTimestamp(new Date(Date.now()));

    let queryValues = 'VALUES ';
    scrapedAdDetails.forEach(ad => {  
        queryValues += '(' + `"${createdDate}","${createdDate}","${ad.postedDate}","${ad.jobDescription}"),`
    });
    queryValues = queryValues.slice(0, -1);

    console.log("about to query the database");
    try {
        db.run(`INSERT INTO ad_details (created_at,updated_at,posting_date,ad_content)
            ${queryValues};`
        );
     } catch (exception) {
        console.log(exception);
        throw exception('An exception occurred while inserting scraped ads into the DB!');
    } finally {
        closeDB(db);
    }
}

module.exports = {
    storeAdsToDB: storeAds,
    storeAdDetails: storeAdDetails
}
