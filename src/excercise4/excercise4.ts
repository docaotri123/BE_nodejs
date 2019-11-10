import { performance } from "perf_hooks";

const ARRIVALS = [1, 3, 5];
const DEPARTURES = [2, 6, 10];
const K = 1;

const checkBooking = (arrivals = ARRIVALS, 
    departures = DEPARTURES, k = K ) => {
    const n = arrivals.length;
    if(departures.length !== n || k <= 0 && departures.length) {
        return false;
    }
    for(let i = 1; i< n; i++) {
        if(arrivals[i] < departures[i-1] && k <= 1 || arrivals[i] > departures[i]){
            return false;
        }
    }
    return true;
}

const getTimeCheckBooking = () => {
    const t0 = performance.now();
    checkBooking(ARRIVALS, DEPARTURES, K);
    const t1 = performance.now();
    return t1 - t0;
}

export const excercise4 = () => {
    return {
        isBooking: checkBooking(),
        time: getTimeCheckBooking() +'ms'
    }
}