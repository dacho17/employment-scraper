import datefns from 'date-fns';
import constants from '../constants';
import { AdPostedAgoTimeframe } from '../dataLayer/enums/adPostedAgoTimefram';

// TODO: make sure that the timezones are standardized and stored to the database. From there we serve dates according to the timezone user is in
export default class Utils {
    async formatJobProps(jobPropsElement): Promise<string> {
        const jobProps = await Promise.all(jobPropsElement.map(async jobPropEl => await jobPropEl.evaluate(el => el.textContent)));
        jobPropsElement.forEach(async elem => await elem.dispose());
    
        return jobProps.reduce((total, current) => total.trim() + ' ' + current.trim());
    }

    getPostedDate4SimplyHired(textContainingPostedAgo: string): Date {
        if (!textContainingPostedAgo || textContainingPostedAgo == '') return new Date(null);
        if (textContainingPostedAgo.trim().toLowerCase() == AdPostedAgoTimeframe.TODAY) {
            return new Date(Date.now());
        } else {
            const numberOfDaysText = textContainingPostedAgo.substring(0, textContainingPostedAgo.indexOf(constants.SIMPLY_HIRED_DAY_MARK));
            const postedAgo = parseInt(numberOfDaysText);
    
            return datefns.addDays(Date.now(), -postedAgo);
        }
    }

    getPostedDate4CareerBuilder(textContainingPostedAgo: string): Date {
        const [postedAgoText, timeframe, _] = textContainingPostedAgo.trim().split(constants.WHITESPACE);
        const postedAgo = parseInt(postedAgoText);
        if (textContainingPostedAgo.trim().toLowerCase() == AdPostedAgoTimeframe.TODAY) {
            return new Date(Date.now());
        } else if (!isNaN(postedAgo)) {
            const timeframeCheck = timeframe.trim().toLowerCase();
            if (timeframeCheck.includes(AdPostedAgoTimeframe.DAY)) return datefns.addDays(Date.now(), -postedAgo);
            else if (timeframeCheck.includes(AdPostedAgoTimeframe.MONTH)) return datefns.addMonths(Date.now(), -postedAgo);
            else return new Date(null);
        }
    
        return new Date(null);
    }

    getPostedDate4LinkedIn(textContainingPostedAgo: string): Date {
        const [postedAgoText, timeframe, _] = textContainingPostedAgo.trim().split(constants.WHITESPACE)
        const postedAgo = parseInt(postedAgoText);
    
        if (isNaN(postedAgo)) return new Date(null);
    
        if (timeframe.includes(AdPostedAgoTimeframe.DAY)) {
            return datefns.addDays(Date.now(), -postedAgo);
        }
        else if (timeframe.includes(AdPostedAgoTimeframe.WEEK)) {
            return datefns.addWeeks(Date.now(), -postedAgo);
        }
        else if (timeframe.includes(AdPostedAgoTimeframe.MONTH)) {
            return datefns.addMonths(Date.now(), -postedAgo);
        }
        else {
            return new Date(null);
        }
    }

    getPostedDate4Indeed(textContainingPostedAgo: string): Date {
        const postedDaysAgo = parseInt(textContainingPostedAgo.split(constants.WHITESPACE)[1]);
    
        if (isNaN(postedDaysAgo)) return new Date(null);
    
        return datefns.addDays(Date.now(), -postedDaysAgo);
    }

    getPostedDate4CareerJet(textContainingPostedAgo: string): Date {
        const [postedAgoText, timeframe, _] = textContainingPostedAgo.trim().split(constants.WHITESPACE)
        const postedAgo = parseInt(postedAgoText);
    
        if (isNaN(postedAgo)) return new Date(null);
    
        if (timeframe.includes(AdPostedAgoTimeframe.HOUR)) {
            return datefns.addHours(Date.now(), -postedAgo);
        }
        else if (timeframe.includes(AdPostedAgoTimeframe.DAY)) {
            return datefns.addDays(Date.now(), -postedAgo);
        }
        else if (timeframe.includes(AdPostedAgoTimeframe.MONTH)) {
            return datefns.addMonths(Date.now(), -postedAgo);
        }
        else {
            return new Date(null);
        }
    }

    getNumberOfApplicants(textContainingNumberOfApplicants) {
        let isThereANumber = false
        textContainingNumberOfApplicants.trim().split(constants.WHITESPACE).forEach(element => {
            if (!isNaN(element.trim())) isThereANumber = true;
        });
    
        const [firstPart, secondPart, _] = textContainingNumberOfApplicants.trim().split(constants.WHITESPACE);
        if (isThereANumber == false) {
            return constants.NO_APPLICANTS;
        }
        else if (!isNaN(firstPart)) {
            return firstPart.trim();
        }
        else if (isNaN(firstPart) && !isNaN(secondPart)) {
            return secondPart.trim() + constants.PLUS_SIGN;
        }
        else {
            return constants.APPLICANT_DATA_UNKNOWN;
        }
    }

    static transformToTimestamp(date: string): number {
        const timestamp = Date.parse(date);
        if (isNaN(timestamp)) return Date.parse((new Date(null).toString()));

        return timestamp;
    }
}

// this can be substituted by replace
// function formatQueryWord(queryWord, splitOn, delimiter) {
//     let totalQueryWord = '';

//     let splitQueryWord = queryWord.split(splitOn);
//     splitQueryWord.forEach((word, index) => {
//         totalQueryWord += word;
//         if (index != splitQueryWord.length - 1) {
//             totalQueryWord += delimiter;
//         }
//     });

// 	  return totalQueryWord;
// }

// function formatEntry(entry) {
//     if (!entry) return;

//     entry = entry.replace('\"', '\'');
//     entry = entry.replace('\n', ' ');
//     entry = entry.trim();

//     return entry;
// }
