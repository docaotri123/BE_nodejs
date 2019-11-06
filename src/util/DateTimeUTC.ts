import * as moment from 'moment';


export class MomentDateTime {

    public static getCurrentDate(): Date {
        return moment.utc().toDate();
    }

    public static getDateUtc(date) {
        return moment.utc(date).toDate();
    }

}
