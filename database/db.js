const sqlite3 = require('sqlite3').verbose();

function createDBschema(db) {
    db.serialize(() => {
        db.run(`
        CREATE TABLE IF NOT EXISTS job_ads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at INTEGER DEFAULT NULL,
            updated_at INTEGER DEFAULT NULL,
            source TEXT,
            job_link TEXT,
            are_details_scraped BOOLEAN DEFAULT FALSE,
            details_scraped_date INTEGER DEFAULT NULL
            job_title TEXT,
            posting_date INTEGER DEFAULT NULL,
            company_name TEXT,
            company_location TEXT,
            company_link TEXT,
            work_location TEXT,
            job_engagement TEXT,
            salary_info TEXT,
            n_of_applicants TEXT,
            ad_content TEXT,
            additional_data TEXT
        );`);
    });
}

function connectToDB() {
    const db = new sqlite3.Database('./jobScraping.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
        if (err) {
            console.log(err.message);
        }
        console.log('Connected to the database!');
    });

    createDBschema(db);
    
    return db;
}

function closeDB(db) {
    db.close(err => {
        if (err) {
            console.log(err.message);
        }
        console.log('Closed the database connection');
    });
}

module.exports = {
    connectToDB: connectToDB,
    closeDB: closeDB
}
