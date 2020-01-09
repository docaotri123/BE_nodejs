// import { expect, should } from 'chai';
// import 'mocha';

// import { createConnection, getConnection, getConnectionManager } from 'typeorm';
// import { sqlConfig_test } from '../../app.config';
// import { BookRoomService } from '../../service/BookRoomService'
// import { Role } from '../../entity/Role';

// describe('BookingService', () => {

//     describe('check getRandomBooking',() => {

//         it('getRandomBooking', async () => {
//             const booking =  await BookRoomService.getRandomBooking();
            
//             if (booking) {
//                 should().exist(booking);
//             }
//             else {
//                 should().not.exist(booking);
//             }
//         })
//     })

//     describe('check getBookingById',() => {

//         it('getBookingById is null', async () => {
//             const booking =  await BookRoomService.getBookingById(-1);
//             should().not.exist(booking);
//         })
//     })

// })