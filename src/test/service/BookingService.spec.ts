import { expect, should } from 'chai';
import 'mocha';
import { arrDate, arrOne, arrTwo, arrThree, itemQueue } from '../../mock/MockConstant';

import { BookingService } from '../../service/BookingService';
import { createConnection } from 'typeorm';
import { sqlConfig } from '../../app.config';

describe('Test BookingService', () => {
    let mock, arr1, arr2, arr3;
    beforeEach(() => {
        mock = arrDate;
        arr1 = arrOne;
        arr2 = arrTwo;
        arr3 = arrThree;
    })
    describe('Check min max Date', () => {
        it('get item have min date', () => {
            const min = BookingService.minStartDate(mock);
            expect(min.startDate).to.equal(1);
        })
    
        it('get item have max date', () => {
            const max = BookingService.maxEndDate(mock);
            expect(max.endDate).to.equal(5);
        })
    })

    describe('check exists in 2 array', () => {
        it('check every index array 2 exists in array 1', () => {
            const arr = BookingService.mapExistsInTwoArray(arr1, arr3);
            for (let i = 0; i < arr.length; i++) {
                expect(arr[i]).to.have.property('isExists');
                expect(arr[i].isExists).to.equal(true);   
            }
        })
    
        it('check index = 1 in array 2 not exists in array 1', () => {
            const arr = BookingService.mapExistsInTwoArray(arr1, arr2);
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


})