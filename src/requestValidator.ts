import { EuroJobSitesField } from "./dataLayer/enums/euroJobSitesField.js";

function validateJobTitle(jobTitle: any) {
    return jobTitle !== undefined && jobTitle !== null && jobTitle.trim() !== '';    // checking if it exists and not an empty string
}

// NOTE: implementation is the same as for validateJobTitle
function validateLocation(location: any) {
    return location !== undefined && location !== null && location.trim() !== '';    // checking if it exists and not an empty string
}

function validateNofAds(numberOfAds: any) {
    return numberOfAds !== undefined && numberOfAds !== null && (!isNaN(numberOfAds) || parseInt(numberOfAds)) && numberOfAds > 0;
}

function validateFieldOfWork(fieldOfWork: any) {
    return fieldOfWork !== undefined && fieldOfWork !== null && Object.values(EuroJobSitesField).includes(fieldOfWork);
}

function validateIfBoolean(someVar: any) {
    return someVar === true || someVar === false;
}

export default {
    validateJobTitle: validateJobTitle,
    validateNofAds: validateNofAds,
    validateFieldOfWork: validateFieldOfWork,
    validateLocation: validateLocation,
    validateIfBoolean: validateIfBoolean
}
