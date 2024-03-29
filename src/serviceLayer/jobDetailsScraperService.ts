import Browser from "../browserAPI";
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

    // NOTE: some test urls which can be used per website when scraping job Details
    // Adzuna 'https://www.adzuna.com/details/3993306546'
    // ArbeitNow 'https://www.arbeitnow.com/view/roetgen-hauptstrasse-padagogische-fachkraft-in-der-krippe-dibber-ggmbh-208571'
    // CareerBuilder 'https://www.careerbuilder.com/job/JMD8868H59367G27E5V'
    // CareerJet 'https://www.careerjet.com/jobad/usabd6878701761e42480d02bbaa3763b0'
    // CVlibrary 'https://www.cv-library.co.uk/job/218950491/Python-Developer?hlkw=python-developer&sid=1f2049be-888e-4f1e-b15d-f4ecf1b93621'
    // EuroJobs 'https://eurojobs.com/united-kingdom/job/275931023/python-developer-oxfordshire.html?searchId=1679730379.4147&page=1'
    // EuroJobSistes 'https://www.euroengineerjobs.com/job_display/235949/Design_Engineer_LSS_Large_Space_Structures_Eching'
    // Graduateland 'https://graduateland.com/job/51759939/13'
    // Indeed 'https://www.indeed.com/viewjob?jk=e7db9718b72e5d7e&tk=1gsdgpri1kp3n801&from=serp&vjs=3'
    // JobFluent 'https://www.jobfluent.com/jobs/senior-php-developer-drupal-madrid-8d3681?result=1'
    // JobsInNetwork 'https://www.jobsinnetwork.com/jobs/software-developer/fb4437db718c77795475b70e5dfade26?subid=jobsinnetwork'
    // LinkedIn 'https://www.linkedin.com/jobs/view/elementary-teacher-at-dinwiddie-county-public-schools-3543460045?refId=WqvtSv3CS57Fw2kqcTFETg%3D%3D&trackingId=LvLGGYqtIlO6hP9TCCqGrQ%3D%3D&trk=public_jobs_topcard-title'
    // NoFluff 'https://nofluffjobs.com/job/software-configuration-engineer-fis-technology-services-poland-warsaw-1'
    // Qreer 'https://www.qreer.com/jobs/view/13785/sr-product-engineer#keyword%3Apython+developer%2Fpage%3A2'
    // SimplyHired 'https://www.simplyhired.com/job/0kZxAj4Qs57dsIXfJaTCknyUN5hw_zeL0eLCoEwyP4uZtt8b0DqKfA'
    // Snaphunt 'https://snaphunt.com/jobs/HMQCNANIJZ'
    // Tyba 'https://tyba.com/job/51453087/14/python-developer'
    // WWR 'https://weworkremotely.com/remote-jobs/trustworthy-full-stack-software-engineer-react-python'

    const url = 'https://www.eurosciencejobs.com/job_display/236024/Scientific_Editor_The_EMBO_Journal_EMBO_European_Molecular_Biology_Organization_Heidelberg';
    let scrapedJobDetails: JobDetails[] | null = null;
    try {
        const browser = await Browser.run();
        const page = await Browser.openPage(browser, url);
        console.log('About to scrape ' + url);

        const newJobDetails: JobDetails = {
            jobTitle: null,
            companyName: null,
            companyLocation: null,
            jobDetails: null,
            timeEngagement: null,
            salary: null,
            requiredSkills: null,
            postedDate: null,
            jobDescription: null
        };

        scrapedJobDetails = await scraperFunc(page, url, newJobDetails);

        console.log('scrape finished');
        await Browser.close(browser);
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
