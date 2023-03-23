const Constants = {
    TYBA_URL: 'https://tyba.com',
    EURO_ENGINEERING_URL: 'https://www.euroengineerjobs.com',
    EURO_SCIENCE_URL: 'https://www.eurosciencejobs.com',
    EURO_SPACE_CAREERS_URL: 'https://www.space-careers.com',
    EURO_TECH_URL: 'https://www.eurotechjobs.com',


    LN_DETAIL_LOCATION_SELECTOR: '.sub-nav-cta__meta-text',
    LN_DETAIL_JOBTITLE_SELECTOR: '.sub-nav-cta__header',
    LN_DETAIL_COMPANY_SELECTOR: '.sub-nav-cta__optional-url',
    LN_DETAIL_POSTINGDATE_SELECTOR: '.posted-time-ago__text',
    LN_DETAIL_NOFAPPLICANTS_SELECTOR: '.num-applicants__caption',
    LN_DETAIL_ADCONTENT_SELECTOR: '.show-more-less-html__markup',
    LN_DETAIL_JOBPROPS_SELECTOR: '.description__job-criteria-text--criteria',

    LN_AD_JOB_LINK_SELECTOR: '.base-card__full-link',
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

    WHITESPACE_URL_ENCODING: '%20',
    UFT_PLUS_SIGN_ENCODING: '%2B',
    ASCII_COMMA_SIGN_ENCODING: '%2C',

    VALUE_SELECTOR: 'value',
    HREF_SELECTOR: 'href',
    ARIALABEL_SELECTOR: 'aria-label',
    ID_SELECTOR: 'id',

    CAREER_JET_JOBLINKS_SELECTOR: '.job.clicky > header > h2 > a',
    TYBA_JOBLINKS_SELECTOR: '#timeline > .section-view-list > .bem-enabled > a',
    NO_FLUFF_JOBS_JOBLINKS_SELECTOR: '.list-container > .posting-list-item',
    QREER_JOBLINKS_SELECTOR: '.jobs-list > ul > li > .job',
    SIMPLY_HIRED_JOBLINKS_SELECTOR: 'h3[data-testid="searchSerpJobTitle"] > a',
    WE_WORK_REMOTELY_JOBLINKS_SELECTOR: 'li > a',
    WE_WORK_REMOTELY_JOBLINKS_SELECTOR_TWO: '.jobs > article > ul > li > a',

    SIMPLY_HIRED_NAVIGATION_BUTTONS_SELECTOR: 'nav[role="navigation"] > a',

    WE_WORK_REMOTELY_JOB_SECTION_SELECTOR: '.jobs-container > .jobs',
    WE_WORK_REMOTELY_VIEW_ALL_JOBS_SELECTOR: 'article > ul > .view-all > a',
  
    

    CV_LIBRARY_JOBLINK_SUFFIX: '-jobs',
    CV_LIBRARY_JOBLINKS_SELECTOR: '#searchResults > .results__item > article > div > h2 > a',   // article > div > h2 > a added here

    EURO_ENGINEER_JOBLINKS_SELECTOR_ONE: '.searchList > li > div > div > div > a',
    EURO_ENGINEER_JOBLINKS_SELECTOR_TWO: '.searchList > li > div > div > div > div > div > h3 > a',

    JOB_FLUENT_JOBLINKS_SELECTOR: '.offer-title > a',

    JOBS_IN_NETWORK_JOBITEMS_SELECTOR: '.section-jobs-listing > .section-jobs-item',
    JOBS_IN_NETWORK_JOBTITLE_SELECTOR: '.card-job > .card-job-body > .card-job-body-title',
    JOBS_IN_NETWORK_JOBID_SELECTOR: '.card-job',

    ARBEITNOW_JOB_ADS: '#results > li',
    ARBEITNOW_JOB_LINK: ['div > .items-center > div > a', 'href'],
    ARBEITNOW_SOURCE: 'ARBEITNOW',

    CAREER_BUILDER_JOB_ADS: 'li > .job-listing-item',
    CAREER_BUILDER_POSTINGDATE_SELECTOR: '.data-results-publish-time',
    CAREER_BUILDER_JOBDETAILS_SELECTOR: '.data-details',
    CAREER_BUILDER_JOBLINK_SELECTOR: ['name', 'href'],    

    ADZUNA_SELECTOR_JOB_ADS: '.ui-search-results > div[data-aid] > .w-full',
    ADZUNA_SELECTOR_JOB_LINK: ['.flex.gap-4 > h2 > a', 'href'],
    ADZUNA_DELIMITER: '%20',

    SIMPLY_HIRED_DAY_MARK: 'd',

    NO_APPLICANTS: 'No applicants yet',
    APPLICANT_DATA_UNKNOWN: 'Data on applicants is unknown',
    UNDISCLOSED_SALARY: 'Undisclosed',
    UNDEFINED_FIELD_OF_WORK: 'The field of work is undefined'
}

export default Constants;
