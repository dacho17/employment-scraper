import datefns from 'date-fns';
import { addHours, addDays, addWeeks, addMonths} from 'date-fns';
import constants from '../constants.js';
import { AdPostedAgoTimeframe } from '../dataLayer/enums/adPostedAgoTimeframe.js';

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

    static getPostedDate4NoFluff(textContainingPostedAgo: string): Date {
        const splitEntry = textContainingPostedAgo.trim().split(constants.WHITESPACE)

        if (splitEntry.length < 6) return new Date(null);
        const postedAgoText = splitEntry[4];
        const timeframe = splitEntry[5];
        const postedAgo = parseInt(postedAgoText);

        if (isNaN(postedAgo)) return new Date(null);
    
        if (timeframe.includes(AdPostedAgoTimeframe.DAY)) {
            return addDays(Date.now(), -postedAgo);
        }
        else if (timeframe.includes(AdPostedAgoTimeframe.WEEK)) {
            return addWeeks(Date.now(), -postedAgo);
        }
        else if (timeframe.includes(AdPostedAgoTimeframe.MONTH)) {
            return addMonths(Date.now(), -postedAgo);
        }
        else {
            return new Date(null);
        }
    }

    static getPostedDate4LinkedIn(textContainingPostedAgo: string): Date {
        const [postedAgoText, timeframe, _] = textContainingPostedAgo.trim().split(constants.WHITESPACE)
        const postedAgo = parseInt(postedAgoText);
    
        if (isNaN(postedAgo)) return new Date(null);
    
        if (timeframe.includes(AdPostedAgoTimeframe.DAY)) {
            return addDays(Date.now(), -postedAgo);
        }
        else if (timeframe.includes(AdPostedAgoTimeframe.WEEK)) {
            return addWeeks(Date.now(), -postedAgo);
        }
        else if (timeframe.includes(AdPostedAgoTimeframe.MONTH)) {
            return addMonths(Date.now(), -postedAgo);
        }
        else {
            return new Date(null);
        }
    }

    static getPostedDate4Indeed(textContainingPostedAgo: string): Date {
        const [_, postedAgoText, timeframe] = textContainingPostedAgo.trim().split(constants.WHITESPACE);
        const postedAgo = parseInt(postedAgoText);
    
        if (isNaN(postedAgo)) return new Date(null);
    
        if (timeframe.includes(AdPostedAgoTimeframe.DAY)) {
            return addDays(Date.now(), -postedAgo);
        } else if (timeframe.includes(AdPostedAgoTimeframe.MONTH)) {
            return addMonths(Date.now(), -postedAgo);
        }

        return new Date(null);
    }

    static getPostedDate4CareerJet(textContainingPostedAgo: string): Date {
        const [postedAgoText, timeframe, _] = textContainingPostedAgo.trim().split(constants.WHITESPACE)
        const postedAgo = parseInt(postedAgoText);

        if (timeframe.includes(AdPostedAgoTimeframe.NOW)) {
            return new Date(Date.now());
        }

        if (isNaN(postedAgo)) {
            return new Date(null);
        } else if (timeframe.includes(AdPostedAgoTimeframe.HOUR)) {
            return addHours(Date.now(), -postedAgo);
        }
        else if (timeframe.includes(AdPostedAgoTimeframe.DAY)) {
            return addDays(Date.now(), -postedAgo);
        }
        else if (timeframe.includes(AdPostedAgoTimeframe.MONTH)) {
            return addMonths(Date.now(), -postedAgo);
        }
        else {
            return new Date(null);
        }
    }

    static getPostedDate4CvLibrary(textContainingPostedAgo: string): Date {
        const [firstPart, secondPart, _] = textContainingPostedAgo.trim().split(constants.WHITESPACE);

        if (!isNaN(Date.parse(firstPart))) {
            return new Date(Date.parse(firstPart));
        } else if (firstPart.includes(AdPostedAgoTimeframe.TODAY)) {
            return new Date(Date.now());
        } else if (firstPart.includes(AdPostedAgoTimeframe.YESTERDAY)) {
            return addDays(Date.now(), -1);
        } else if (firstPart.includes('a')) {
            console.log('about to read addweeks');
            const newDate =  addWeeks(Date.now(), -1);
            console.log(newDate)
            return newDate;
        } else if (!isNaN(parseInt(firstPart))) {
            if (secondPart.includes(AdPostedAgoTimeframe.DAY)) {
                return addDays(Date.now(), -parseInt(firstPart))
            } else if (secondPart.includes(AdPostedAgoTimeframe.WEEK)) {
                return addWeeks(Date.now(), -parseInt(firstPart));
            } else {
                return new Date(null);
            }
        }
        return new Date(null);
    }

    static getPostedDate4Graduateland(textContainingPostedAgo: string): Date {
        const [_, firstPart, secondPart] = textContainingPostedAgo.trim().split(constants.WHITESPACE);

        if (secondPart.includes(AdPostedAgoTimeframe.DAY)) {
            return addDays(Date.now(), -parseInt(firstPart))
        } else if (secondPart.includes(AdPostedAgoTimeframe.WEEK)) {
            return addWeeks(Date.now(), -parseInt(firstPart));
        } else {
            return new Date(null);
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
