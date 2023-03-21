const datefns = require("date-fns");
const constants = require('../constants');

// enum TIMEFRAME { TODO: needs to be rewritten in Typescript!!!!
//     DAY,
//     WEEK,
//     MONTH
// }

function getPostedDate4SimplyHired(textContainingPostedAgo) {
    if (!textContainingPostedAgo || textContainingPostedAgo == '') return new Date(null);
    if (textContainingPostedAgo.trim().toLowerCase() == 'today') {
        return new Date(Date.now());
    } else {
        let numberOfDaysText = textContainingPostedAgo.substring(0, textContainingPostedAgo.indexOf('d'));
        let postedAgo = parseInt(numberOfDaysText);

        return datefns.addDays(Date.now(), -postedAgo);
    }
}

function getPostedDate4CareerBuilder(textContainingPostedAgo) {
    const [postedAgoText, timeframe, _] = textContainingPostedAgo.trim().split(' ');
    const postedAgo = parseInt(postedAgoText);
    if (textContainingPostedAgo.trim().toLowerCase() == 'today') {
        return new Date(Date.now());
    } else if (!isNaN(postedAgo)) {
        let timeframeCheck = timeframe.trim().toLowerCase();
        if (timeframeCheck.includes('day')) return datefns.addDays(Date.now(), -postedAgo);
        else if (timeframeCheck.includes('month')) return datefns.addMonths(Date.now(), -postedAgo);
        else return new Date(null);
    }

    return new Date(null);
}

function getPostedDate4LinkedIn(textContainingPostedAgo) {
    const [postedAgoText, timeframe, _] = textContainingPostedAgo.trim().split(' ')
    const postedAgo = parseInt(postedAgoText);

    if (isNaN(postedAgo)) return new Date(null);

    if (timeframe.includes('day')) {
        return datefns.addDays(Date.now(), -postedAgo);
    }
    else if (timeframe.includes('week')) {
        return datefns.addWeeks(Date.now(), -postedAgo);
    }
    else if (timeframe.includes('month')) {
        return datefns.addMonths(Date.now(), -postedAgo);
    }
    else {
        return new Date(null);
    }
}

function getPostedDate4Indeed(textContainingPostedAgo) {
    let postedDaysAgo = parseInt(textContainingPostedAgo.split(' ')[1]);

    let now = Date.now();
    let postedDate = datefns.addDays(now, -postedDaysAgo);

    return postedDate;
}

function getPostedDate4CareerJet(textContainingPostedAgo) {
    const [postedAgoText, timeframe, _] = textContainingPostedAgo.trim().split(' ')
    const postedAgo = parseInt(postedAgoText);

    if (isNaN(postedAgo)) return new Date(null);

    if (timeframe.includes('hour')) {
        return datefns.addHours(Date.now(), -postedAgo);    // TODO: make sure that the timezones match!
    }
    else if (timeframe.includes('day')) {
        return datefns.addDays(Date.now(), -postedAgo);
    }
    else if (timeframe.includes('month')) {
        return datefns.addMonths(Date.now(), -postedAgo);
    }
    else {
        return new Date(null);
    }
}

function getNumberOfApplicants(textContainingNumberOfApplicants) {
    let isThereANumber = false
    textContainingNumberOfApplicants.trim().split(' ').forEach(element => {
        if (!isNaN(element.trim())) isThereANumber = true;
    });

    let [firstPart, secondPart, _] = textContainingNumberOfApplicants.trim().split(' ');
    if (isThereANumber == false) {
        return constants.NO_APPLICANTS;
    }
    else if (!isNaN(firstPart)) {
        return firstPart.trim();
    }
    else if (isNaN(firstPart) && !isNaN(secondPart)) {
        return secondPart.trim() + '+';
    }
    else {
        return constants.APPLICANT_DATA_UNKNOWN;
    }
}

function transformToTimestamp(date)  {
    return Date.parse(date);
}

module.exports = {
    getPostedDate4CareerBuilder: getPostedDate4CareerBuilder,
    getPostedDate4SimplyHired: getPostedDate4SimplyHired,
    getPostedDate4LinkedIn: getPostedDate4LinkedIn,
    getPostedDate4Indeed: getPostedDate4Indeed,
    getPostedDate4CareerJet: getPostedDate4CareerJet,
    getNumberOfApplicants: getNumberOfApplicants,
    transformToTimestamp: transformToTimestamp
}
