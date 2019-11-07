import * as moment from 'moment';


export class MomentDateTime {

    public static getCurrentDate(): Date {
        return moment.utc().toDate();
    }

    public static getDateUtc(date) {
        return moment.utc(date).toDate();
    }

    public static endSpecificDayUtc(timestamp) {
        return moment.utc(timestamp).set({
            'hour' : 23,
            'minute': 59,
            'second': 59
        }).toDate();
    }

    public static startSpecificDayUtc(timestamp) {
        return moment.utc(timestamp).set({
            'hour' : 0,
            'minute': 0,
            'second': 0
        }).toDate();
    }

}
