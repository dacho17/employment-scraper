import sqlite3 from "sqlite3";
import { open } from 'sqlite'

async function createDBschema(db) {
    await db.run(`
        CREATE TABLE IF NOT EXISTS job_ads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at INTEGER,
            updated_at INTEGER,
            source TEXT,
            job_link TEXT,
            are_details_scraped BOOLEAN DEFAULT FALSE,
            details_scraped_date INTEGER DEFAULT NULL,
            job_title TEXT DEFAULT NULL,
            posting_date INTEGER DEFAULT NULL,
            company_name TEXT DEFAULT NULL,
            company_location TEXT DEFAULT NULL,
            company_link TEXT DEFAULT NULL,
            work_location TEXT DEFAULT NULL,
            job_engagement TEXT DEFAULT NULL,
            salary_info TEXT DEFAULT NULL,
            n_of_applicants TEXT DEFAULT NULL,
            ad_content TEXT DEFAULT NULL,
            additional_data TEXT DEFAULT NULL
        );`
    );
}

async function connectToDB() {
    try {
        const db = await open({
            filename: './jobAdDB.db',
            mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            driver: sqlite3.Database
        });
        
        console.log('Connected to the database!');
        await createDBschema(db);

        return db;
    } catch (exception) {
        console.log('Connection failed');
    }
}

async function closeDB(db) {
    try {
        await db.close();
        console.log('Connection to the database terminated.');
    } catch (exception) {
        console.log(exception);
    }
}

export default {
    connectToDB: connectToDB,
    closeDB: closeDB
}
