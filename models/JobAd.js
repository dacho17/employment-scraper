export class JobAd {
    createdDate;
    updatedDate;
    source;
    jobLink;
    areDetailsScraped;
    detailsScrapedDate;
    jobTitle;
    postingDate;
    companyName;
    companyLocation;
    companyLink;
    workLocation;
    jobEngagement;
    salaryInfo;
    nOfApplicants;
    adContent;
    additionalData;
    constructor(createdDate, updatedDate, source, jobLink, areDetailsScraped, detailsScrapedDate, jobTitle, postingDate, companyName, companyLocation, companyLink, workLocation,
        jobEngagement, salaryInfo, nOfApplicants, adContent, additionalData) {
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.source = source;
        this.jobLink = jobLink;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.companyLocation = companyLocation;
        this.companyLink = companyLink;
        this.workLocation = workLocation;
        this.jobEngagement = jobEngagement;
        this.salaryInfo = salaryInfo;
        this.postingDate = postingDate;
        this.areDetailsScraped = areDetailsScraped;
        this.detailsScrapedDate = detailsScrapedDate;
        this.nOfApplicants = nOfApplicants;
        this.adContent = adContent;
        this.additional = additionalData
    }
}
