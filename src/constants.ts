const Constants = {
    TYBA_URL: 'https://tyba.com',
    EURO_ENGINEERING_URL: 'https://www.euroengineerjobs.com',
    EURO_SCIENCE_URL: 'https://www.eurosciencejobs.com',
    EURO_SPACE_CAREERS_URL: 'https://www.space-careers.com',
    EURO_TECH_URL: 'https://www.eurotechjobs.com',
    CAREER_JET_URL: 'https://www.careerjet.com',
    CV_LIBRARY_URL: 'https://www.cv-library.co.uk',
    JOB_FLUENT_URL: 'https://www.jobfluent.com',
    JOBS_IN_NETWORK_URL: 'https://www.jobsinnetwork.com',
    NO_FLUFF_JOBS_URL: 'https://nofluffjobs.com',
    QREER_URL: 'https://www.qreer.com',
    SIMPLY_HIRED_URL: 'https://www.simplyhired.com',
    WE_WORK_REMOTELY_URL: 'https://weworkremotely.com',
    CAREER_BUILDER_URL: 'https://www.careerbuilder.com',
    INDEED_URL: 'https://www.indeed.com',
    GRADUATELAND_URL: 'https://graduateland.com',

    LN_DETAIL_LOCATION_SELECTOR: '.sub-nav-cta__meta-text',
    LN_DETAIL_JOBTITLE_SELECTOR: '.sub-nav-cta__header',
    LN_DETAIL_COMPANY_SELECTOR: '.sub-nav-cta__optional-url',
    LN_DETAIL_POSTINGDATE_SELECTOR: '.posted-time-ago__text',
    LN_DETAIL_NOFAPPLICANTS_SELECTOR: '.num-applicants__caption',
    LN_DETAIL_ADCONTENT_SELECTOR: '.show-more-less-html__markup',
    LN_DETAIL_JOBPROPS_SELECTOR: '.description__job-criteria-text--criteria',

    LN_AD_JOB_LINK_PROPS: ['name', 'href'],
    LN_AD_JOB_TITLE_SELECTOR: '.base-search-card__title',
    LN_AD_COMPANY_NAME_SELECTOR: '.base-search-card__subtitle',
    LN_AD_LOCATION_SELECTOR: '.job-search-card__location',
    LN_AD_SALARYINFO_SELECTOR: '.job-search-card__salary-info',
    LN_AD_LISTEDDATES_SELECTOR: '.job-search-card__listdate',
    LN_AD_LISTEDDATES_PROPS: ['name', 'datetime'],

    INDEED_JOBLINK_SELECTOR: 'job-link',
    INDEED_JOBTITLE_SELECTOR: 'job-title',
    INDEED_COMPANYNAME_SELECTOR: 'company-name',
    INDEED_LOCATION_SELECTOR: 'company-location',
    INDEED_JOBDESCRIPTION_SELECTOR: 'job-snippet',
    INDEED_JOBSALARY_SELECTOR: 'job-salary',
    INDEED_POSTINGDATE_SELECTOR: 'post-date',

    PLUS_SIGN: '+',
    MINUS_SIGN: '-',
    UNDERSCORE: '_',
    WHITESPACE: ' ',
    COMMA: ',',
    EQUALS: '=',

    WHITESPACE_URL_ENCODING: '%20',
    UFT_PLUS_SIGN_ENCODING: '%2B',
    ASCII_COMMA_SIGN_ENCODING: '%2C',

    VALUE_SELECTOR: 'value',
    HREF_SELECTOR: 'href',
    ARIALABEL_SELECTOR: 'aria-label',
    ID_SELECTOR: 'id',
    DATETIME_SELECTOR: 'datetime',
    JOB_DESCRIPTION_COMPOSITION_DELIMITER: ';; ',

    GRADUATELAND_JOBLINKS_SELECTOR: '.job-box',
    EURES_JOBLINKS_SELECTOR: '.ecl-link--standalone',
    INDEED_JOBLINKS_SELECTOR: 'h2.jobTitle > a',
    LN_JOBLINKS_SELECTOR: '.base-card__full-link',
    CAREER_JET_JOBLINKS_SELECTOR: '.job.clicky > header > h2 > a',
    TYBA_JOBLINKS_SELECTOR: '#timeline > .section-view-list > .bem-enabled > a',
    NO_FLUFF_JOBS_JOBLINKS_SELECTOR: '.list-container > .posting-list-item',
    QREER_JOBLINKS_SELECTOR: '.jobs-list > ul > li > .job',
    SIMPLY_HIRED_JOBLINKS_SELECTOR: 'h3[data-testid="searchSerpJobTitle"] > a',
    WE_WORK_REMOTELY_JOBLINKS_SELECTOR: 'li > a',
    WE_WORK_REMOTELY_JOBLINKS_SELECTOR_TWO: '.jobs > article > ul > li > a',

    ADZUNA_DETAILS_EXTEND_AD_BUTTON_SELECTOR: '.ui-foreign-click-description-toggle > a',
    ADZUNA_DETAILS_JOB_TITLE_SELECTOR: 'h1',
    ADZUNA_DETAILS_SUBTITLE_SECTION_SELECTOR: 'div > div > table > tbody > tr > td > strong',
    ADZUNA_DETAILS_JOB_DESCRIPTION_SELECTOR: '.ui-foreign-click-description > section',

    ARBEITNOW_DETAILS_JOB_TITLE_SELECTOR: 'a[itemprop="url"]',
    ARBEITNOW_DETAILS_COMPANY_NAME_SELECTOR: 'a[itemprop="hiringOrganization"]',
    ARBEITNOW_DETAILS_COMPANY_LOCATION_SELECTOR: '.list-none > div > div > div > div > div > div > p',
    ARBEITNOW_DETAILS_JOB_DETAILS_SELECTOR: 'button', // .list-none > 
    ARBEITNOW_DETAILS_POSTED_DATE_SELECTOR: 'time',
    ARBEITNOW_DETAILS_JOB_DESCRIPTION_SELECTOR: 'div[itemprop="description"]',

    CAREER_BUILDER_DETAILS_JOB_TITLE_SELECTOR: '.data-display-header_info-content > h2',
    CAREER_BUILDER_DETAILS_JOB_SUBTITLE_SELECTOR: '.data-display-header_info-content > .data-details > span',
    CAREER_BUILDER_DETAILS_JOB_DESCRIPTION_SELECTOR: '.jdp-left-content',
    CAREER_BUILDER_DETAILS_REQUIRED_SKILLS_SELECTOR: '.jdp-required-skills > ul > li',

    CAREER_JET_DETAILS_JOB_TITLE_SELECTOR: '#job > div > header > h1',
    CAREER_JET_DETAILS_COMPANY_NAME_SELECTOR: '#job > div > header > .company',
    CAREER_JET_DETAILS_JOB_SUBTITLE_SELECTOR: '#job > div > header > .details > li',
    CAREER_JET_DETAILS_POSTED_AGO_SELECTOR: '#job > div > header > .tags > li > span',
    CAREER_JET_DETAILS_JOB_DESCRIPTION_SELECTOR: '#job > div > .content',

    CV_LIBRARY_DETAILS_JOB_TITLE_SELECTOR: '.job__title > span',
    CV_LIBRARY_DETAILS_POSTED_AGO_SELECTOR: '.job__header-posted > span',
    CV_LIBRARY_DETAILS_COMPANY_NAME_SELECTOR: '.job__header-posted > span > a',
    CV_LIBRARY_DETAILS_REMOTE_POSITION_SELECTOR: 'job__icon--remote',
    CV_LIBRARY_DETAILS_JOB_DESCRIPTION_SELECTOR: '.job__description',
    CV_LIBRARY_DETAILS_JOB_DETAILS_KEY_SELECTOR: '.job__details-term',
    CV_LIBRARY_DETAILS_JOB_DETAILS_VALUE_SELECTOR: '.job__details-value',

    EURO_JOBS_DETAILS_JOB_TITLE_SELECTOR: '.listingInfo > h2',
    EURO_JOBS_DETAILS_JOB_DETAILS_KEY_SELECTOR: '.displayFieldBlock > h3',
    EURO_JOBS_DETAILS_JOB_DETAILS_VALUE_SELECTOR: '.displayField',

    EURO_JOB_SITES_DETAILS_ADDITIONAL_JOB_LINK_SELECTOR: '.job-header > div > h2 > a',
    EURO_JOB_SITES_DETAILS_HEADER_SELECTOR: '.job-header > div > h2',
    EURO_JOB_SITES_DETAILS_AD_SELECTOR: '.job-header > div',

    GRADUATELAND_DETAILS_JOB_TITLE_SELECTOR: '.job-title > h1',
    GRADUATELAND_DETAILS_COMPANY_NAME_SELECTOR: '.job-title > h1 > span > a',
    GRADUATELAND_DETAILS_POSTED_AGO_SELECTOR: '.date > span',
    GRADUATELAND_DETAILS_JOB_DETAILS_KEY_SELECTOR: '.content-description > h3',
    GRADUATELAND_DETAILS_JOB_DETAILS_VALUES_SELECTOR: '.content-description > p > span',
    GRADUATELAND_DETAILS_JOB_DESCRIPTION_SELECTOR: '.job-content',

    INDEED_DETAILS_JOB_TITLE_SELECTOR: '.jobsearch-JobInfoHeader-title > span',
    INDEED_DETAILS_COMPANY_NAME_AND_LINK_SELECTOR: '.jobsearch-CompanyAvatar > div > div > div > a',
    INDEED_DETAILS_COMPANY_DESCRIPTION_SELECTOR: '.jobsearch-CompanyAvatar > div > div:last-child',
    INDEED_DETAILS_COMPANY_LOCATION_SELECTOR: '.jobsearch-CompanyInfoWithReview > div > div > div > div:nth-child(2)',
    INDEED_DETAILS_SALARY_SELECTOR: '#salaryInfoAndJobType > span:nth-child(1)',
    INDEED_DETAILS_TIME_ENGAGEMENT_SELECTOR: '#salaryInfoAndJobType > span:nth-child(2)',
    INDEED_DETAILS_JOB_DETAILS_SELECTOR: '.jobsearch-JobDescriptionSection-section',
    INDEED_DETAILS_JOB_DESCRIPTION_SELECTOR: '#jobDescriptionText',
    INDEED_DETAILS_POSTED_AGO_SELECTOR: '.jobsearch-JobComponent-description > div:last-child > ul > li',
    

    SIMPLY_HIRED_NAVIGATION_BUTTONS_SELECTOR: 'nav[role="navigation"] > a',

    WE_WORK_REMOTELY_JOB_SECTION_SELECTOR: '.jobs-container > .jobs',
    WE_WORK_REMOTELY_VIEW_ALL_JOBS_SELECTOR: 'article > ul > .view-all > a',
  
    CV_LIBRARY_JOBLINK_SUFFIX: '-jobs',
    CV_LIBRARY_JOBLINKS_SELECTOR: '#searchResults > .results__item > article > div > h2 > a',
    EURO_JOBS_JOBLINKS_SELECTOR: '.viewDetails > a',

    EURO_JOBS_JOBLINKS_SELECTOR_ONE: '.searchList > li > div > div > div > a',
    EURO_JOBS_JOBLINKS_SELECTOR_TWO: '.searchList > li > div > div > div > div > div > h3 > a',

    JOB_FLUENT_JOBLINKS_SELECTOR: '.offer-title > a',

    JOBS_IN_NETWORK_JOBTITLE_SELECTOR: '.section-jobs-listing > .section-jobs-item > div > div > h2',
    JOBS_IN_NETWORK_JOBID_SELECTOR: '.section-jobs-listing > .section-jobs-item > .card-job',

    ARBEITNOW_JOB_ADS: '#results > li > div > .items-center > div > a',
    ARBEITNOW_SOURCE: 'ARBEITNOW',

    CAREER_BUILDER_JOB_ADS: 'li > .job-listing-item',
    CAREER_BUILDER_POSTINGDATE_SELECTOR: '.data-results-publish-time',
    CAREER_BUILDER_JOBDETAILS_SELECTOR: '.data-details',
    CAREER_BUILDER_JOBLINK_SELECTOR: ['name', 'href'],    

    ADZUNA_JOBLINKS_SELECTOR: '.ui-search-results > div[data-aid] > .w-full > .flex.gap-4 > h2 > a',

    SIMPLY_HIRED_DAY_MARK: 'd',

    NO_APPLICANTS: 'No applicants yet',
    APPLICANT_DATA_UNKNOWN: 'Data on applicants is unknown',
    UNDISCLOSED_SALARY: 'Undisclosed',
    UNDEFINED_FIELD_OF_WORK: 'The field of work is undefined',

    ADS_SCRAPED_SUCCESSFULLY: 'Ads scraped and stored into the database successfully!',
    NO_ADS_FOUND_TO_BE_SCRAPED_MESSAGE: 'No ads have been found on the page given your query.',
    NO_DETAILS_FOUND_TO_BE_SCRAPED_MESSAGE: 'There are no job details to be scraped at the moment.',
    BAD_REQUEST_MESSAGE: 'The request parameters received are faulty.',


    HTTP_OK: 200,
    HTTP_BAD_REQUEST: 400,
    HTTP_SERVER_ERROR: 500
}

export default Constants;