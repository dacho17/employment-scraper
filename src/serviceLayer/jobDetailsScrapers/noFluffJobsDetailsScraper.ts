import Constants from "../../constants"
import { JobDetails } from "../../dataLayer/models/jobDetails"
import Utils from "../../utils/utils";

// jobTitle, salary, workLocation, postedDate, companyName, companyLink, requiredSkills, companyDescripiton, jobDetails, jobDescription
export default async function scrapeData(page: any, url: string, jobDetails: JobDetails): Promise<JobDetails> {
    const showMoreButtonElement = await page.$(Constants.NO_FLUFF_DETAILS_SHOW_MORE_SELECTOR);
    await showMoreButtonElement.evaluate(button => button.click());

    const jobTitleElement = await page.$(Constants.NO_FLUFF_DETAILS_JOB_TITLE_SELECTOR);
    const jobTitle = await page.evaluate(el => el.innerText, jobTitleElement);
    jobDetails.jobTitle = jobTitle.trim();

    const salaryElement = await page.$(Constants.NO_FLUFF_DETAILS_SALARY_SELECTOR);
    const salary = await page.evaluate(el => el.innerText, salaryElement);
    jobDetails.salary = salary.trim();

    const locationsElement = await page.$(Constants.NO_FLUFF_DETAILS_LOCATION_SELECTOR);
    const locations = await page.evaluate(el => el.textContent, locationsElement);
    jobDetails.workLocation = locations.trim();

    const postedAgoElement = await page.$(Constants.NO_FLUFF_DETAILS_POSTED_AGO_SELECTOR);
    const postedAgo = await page.evaluate(el => el.innerText, postedAgoElement);
    const postedDate = Utils.getPostedDate4NoFluff(postedAgo.trim());
    jobDetails.postedDate = Utils.transformToTimestamp(postedDate.toString());

    const companyNameAndLinkElement = await page.$(Constants.NO_FLUFF_DETAILS_COMPANY_NAME_AND_LINK_SELECTOR);
    const companyName = await page.evaluate(el => el.innerText, companyNameAndLinkElement);
    const companyLink = await page.evaluate((el, selector) => el.getAttribute(selector), companyNameAndLinkElement, Constants.HREF_SELECTOR);
    jobDetails.companyName = companyName.trim();
    jobDetails.companyLink = Constants.NO_FLUFF_JOBS_URL + companyLink.trim();

    const requiredSkillsElement = await page.$(Constants.NO_FLUFF_DETAILS_REQUIRED_SKILLS_SELECTOR);
    const requiredSkills = await page.evaluate(el => el.textContent, requiredSkillsElement);
    jobDetails.requiredSkills = requiredSkills.trim();

    const jobDescriptionTotal = [];
    jobDescriptionTotal.push(await page.$(Constants.NO_FLUFF_DETAILS_JOB_REQUIREMENTS_SELECTOR));
    jobDescriptionTotal.push(await page.$(Constants.NO_FLUFF_DETAILS_JOB_DESCRIPTION_SELECTOR));
    jobDescriptionTotal.push(await page.$(Constants.NO_FLUFF_DETAILS_JOB_RESPONSIBILITIES_SELECTOR));
    jobDescriptionTotal.push(await page.$(Constants.NO_FLUFF_DETAILS_EQUIPMENT_SUPPLIED_SELECTOR));
    jobDescriptionTotal.push(await page.$(Constants.NO_FLUFF_DETAILS_JOB_BENEFITS_SELECTOR));

    const descriptonTexts = await Promise.all(jobDescriptionTotal.map(async element => await page.evaluate(el => el.textContent, element)));
    const description = descriptonTexts.join('\n');
    jobDetails.jobDescription = description;

    const jobDetailsElement = await page.$(Constants.NO_FLUFF_DETAILS_JOB_DETAILS_SELECTOR);
    const details = await page.evaluate(el => el.textContent, jobDetailsElement);
    jobDetails.jobDetails = details.trim();

    const companyInfoElement = await page.$(Constants.NO_FLUFF_DETAILS_COMPANY_INFO_SELECTOR);
    const companyInfo = await page.evaluate(el => el.textContent, companyInfoElement);
    jobDetails.companyDescription = companyInfo;

    console.log(jobDetails);

    return jobDetails;
}
