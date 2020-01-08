import { expect, should } from 'chai';
import 'mocha';
import { arrDate, arrOne, arrTwo, arrThree, itemQueue } from '../../mock/MockConstant';

import { createConnection } from 'typeorm';
import { sqlConfig_test } from '../../app.config';
import { BookRoomService } from '../../service/BookRoomService'
import { GroupBooking } from '../../entity/GroupBooking';
import { GroupBookingService } from '../../service/GroupBookingService';

describe.only('BookingService', () => {
    let database = null;

    before(async () => {
        if (!database) {
            database = await createConnection(sqlConfig_test);
        }
    })

    describe('check getRandomBooking',() => {

        it('getRandomBooking', async () => {
            const booking =  await BookRoomService.getRandomBooking();
            
            if (booking) {
                should().exist(booking);
            }
            else {
                should().not.exist(booking);
            }
        })
    })

    describe('check getBookingById',() => {

        it('etBookingById is null', async () => {
            const booking =  await BookRoomService.getBookingById(-1);
            should().not.exist(booking);
        })
    })

})