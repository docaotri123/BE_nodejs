import { expect, should } from 'chai';
import 'mocha';
import { arrDate, arrOne, arrTwo, arrThree, itemQueue } from '../../mock/MockConstant';

import { createConnection } from 'typeorm';
import { sqlConfig } from '../../app.config';
import { BookRoomService } from '../../service/BookRoomService'
import { GroupBooking } from '../../entity/GroupBooking';
import { GroupBookingService } from '../../service/GroupBookingService';

describe.only('BookingService', () => {
    let mock, arr1, arr2, arr3, bookingId = 1;
    beforeEach(() => {
        mock = arrDate;
        arr1 = arrOne;
        arr2 = arrTwo;
        arr3 = arrThree;
    })
    describe('Check min max Date', () => {
        it('get item have min date', () => {
            const min = BookRoomService.minStartDate(mock);
            expect(min.startDate).to.equal(1);
        })
    
        it('get item have max date', () => {
            const max = BookRoomService.maxEndDate(mock);
            expect(max.endDate).to.equal(5);
        })
    })

    describe('check exists in 2 array', () => {
        it('check every index array 2 exists in array 1', () => {
            const arr = BookRoomService.mapExistsInTwoArray(arr1, arr3);
            for (let i = 0; i < arr.length; i++) {
                expect(arr[i]).to.have.property('isExists');
                expect(arr[i].isExists).to.equal(true);   
            }
        })
    
        it('check index = 1 in array 2 not exists in array 1', () => {
            const arr = BookRoomService.mapExistsInTwoArray(arr1, arr2);
            for (let i = 0; i < arr.length; i++) {
                expect(arr[i]).to.have.property('isExists');
            }
            expect(arr[1].isExists).to.equal(false);   
        })
    })

    describe('check handle booking', () => {
        let database = null;

        beforeEach(async () => {
            database = await createConnection(sqlConfig);
        });

        afterEach(()=> {
            database.close();
        })
    })

    describe('check getBookingById is not null', async () => {
        const booking = await BookRoomService.getBookingById(bookingId);
        expect(booking.id).to.equal(1);
    })

    describe('check getBookingById is null', async () => {
        const booking = await BookRoomService.getBookingById(0);
        should().not.exist(booking);
    })

    describe('check getBookingByRoomIdAndStartDate is not null', async () => {
        const isBooked = await BookRoomService.getBookingByRoomIdAndStartDate(1, 123);
        should().exist(isBooked);
    })

    describe('check getBookingByRoomIdAndStartDate is null', async () => {
        const isBooked = await BookRoomService.getBookingByRoomIdAndStartDate(1, 123);
        should().not.exist(isBooked);
    })

    describe('check getBookingByTimes is not null', async () => {
        const data =  await BookRoomService.getBookingByTimes(new Date(), new Date());
        should().exist(data);
    })

    describe('check getBookingByTimes is null', async () => {
        const data =  await BookRoomService.getBookingByTimes(new Date(), new Date());
        should().not.exist(data);
    })

    describe('check getBookingByDays is not null', () => {

    })

    describe('check getBookingByDays is null', () => {
        
    })


})