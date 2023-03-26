import Constants from "../../constants";
import { JobDetails } from "../../dataLayer/models/jobDetails";
import Utils from "../../utils/utils";

// jobTitle, companyName, companyLink, postedAgo, details, description
export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {

    const jobTitleElement = await page.$(Constants.GRADUATELAND_DETAILS_JOB_TITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    const companyNameElement = await page.$(Constants.GRADUATELAND_DETAILS_COMPANY_NAME_SELECTOR);
    const companyName = await page.evaluate(el => el.innerText, companyNameElement);
    const companyLink = await page.evaluate((el, selector) => el.getAttribute(selector), companyNameElement, Constants.HREF_SELECTOR);
    const postedAgoElement = await page.$(Constants.GRADUATELAND_DETAILS_POSTED_AGO_SELECTOR);

    jobDetails.jobTitle = jobTitle.trim();
    jobDetails.companyName = companyName.trim();
    jobDetails.companyLink = url.substring(0, url.indexOf('.com') + 4) + companyLink.trim();
    if (postedAgoElement) {
        const postedAgo = await page.evaluate(el => el.textContent, postedAgoElement);
        const postedDate = Utils.getPostedDate4Graduateland(postedAgo.trim());
        jobDetails.postedDate = Utils.transformToTimestamp(postedDate.toString());

    }

    const keyWords = [];
    const jobDetailsKeysElement = await page.$$(Constants.GRADUATELAND_DETAILS_JOB_DETAILS_KEY_SELECTOR);
    for (let i = 0; i < jobDetailsKeysElement.length; i++) {
        const keyword = await page.evaluate(el => el.innerText, jobDetailsKeysElement[i]);
        keyWords.push(keyword);
    }

    const attempt = await page.$('.content-description');
    const attemptText = await page.evaluate(el => el.textContent, attempt);
    let sol = '';
    let isFirstKeyWord = true;
    attemptText.split(' ').forEach(part => {
        part = part.trim();
        
        if (part != '') {
            if (keyWords.includes(part)){
                if (isFirstKeyWord){
                    sol += part + Constants.EQUALS;
                    isFirstKeyWord = false;
                }
                else {
                    sol = sol.slice(0, -1);
                    sol += Constants.JOB_DESCRIPTION_COMPOSITION_DELIMITER + part + Constants.EQUALS;
                }
            }
            else if (!part.endsWith(Constants.COMMA)) {
                sol += part + Constants.COMMA;
            } else sol += part;
        }
    });
    sol = sol.slice(0, -1);
    jobDetails.jobDetails = sol;

    const jobDescriptionElement = await page.$(Constants.GRADUATELAND_DETAILS_JOB_DESCRIPTION_SELECTOR);
    const jobDescription = await page.evaluate(el => el.textContent, jobDescriptionElement);
    jobDetails.jobDescription = jobDescription.trim();

    return jobDetails;
}
