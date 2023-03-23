import { AdSource } from "../enums/adSource";

export class JobAd {
    createdDate: number;
    updatedDate: number;
    source: AdSource;
    jobLink: string;
    areDetailsScraped?: boolean;
    detailsScrapedDate?: number;
    jobTitle?: string;
    postingDate?: number;
    companyName?: string;
    companyLocation?: string;
    companyLink?: string;
    workLocation?: string;
    jobEngagement?: string;
    salaryInfo?: string;
    nOfApplicants?: string;
    adContent?: string;
    additionalData?: string;

    // public createJobAd(createdDate: number, updatedDate: number, source: AdSource, jobLink: string): JobAd {
    //     let newJobAd: JobAd = {
    //         createdDate: createdDate,
    //         updatedDate: updatedDate,
    //         source: source,
    //         jobLink: jobLink
    //     }
    //     return newJobAd;
    // }
    // constructor(createdDate: number, updatedDate: number, source: AdSource, jobLink: string);
    // constructor(...args: any[]) {
    //     console.log(args)
    //     if (args.length == 4) {
    //         // this.createdDate = args[0];
    //         // this.updatedDate = args[1];
    //         // this.source = args[2];
    //         // this.jobLink = args[3];
    //         console.log('four argument constructor called here !!');
    //     }

        // else {
        //     this.createdDate = createdDate;
        //     this.updatedDate = updatedDate;
        //     this.source = source;
        //     this.jobLink = jobLink;
        //     this.jobTitle = jobTitle;
        //     this.companyName = companyName;
        //     this.companyLocation = companyLocation;
        //     this.companyLink = companyLink;
        //     this.workLocation = workLocation;
        //     this.jobEngagement = jobEngagement;
        //     this.salaryInfo = salaryInfo;
        //     this.postingDate = postingDate;
        //     this.areDetailsScraped = areDetailsScraped;
        //     this.detailsScrapedDate = detailsScrapedDate;
        //     this.nOfApplicants = nOfApplicants;
        //     this.adContent = adContent;
        //     this.additionalData = additionalData
        // }
    // }
}
