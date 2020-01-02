import { expect, should } from 'chai';
import 'mocha';
import { createConnection } from 'typeorm';
import { sqlConfig } from '../../app.config';
import { BookRoomRepository } from '../../repository/BookRoomRepository';
import { BookRoom } from '../../entity/BookRoom';
import { GroupBookingRepository } from '../../repository/GroupBookingRepository';
import { RoomRepository } from '../../repository/RoomRepository';
import { MomentDateTime } from '../../util/DateTimeUTC';


xdescribe('Test BookRoomRepository', () => {
    let db = null, roomID, startDate, booking;
    beforeEach(async () => {
        db = await createConnection(sqlConfig);
        // booking = initBooking();
        roomID = 1;
        startDate = 1577689200000;
        booking = new BookRoom();
        const group = await GroupBookingRepository.getRandomGroup();
        const room = await RoomRepository.getRandomRoom();
        booking.startDate = MomentDateTime.getDateUtc(1577689200000);
        booking.endDate = MomentDateTime.getDateUtc(1577700000000);
        booking.room = room;
        booking.group = group;
    })

    afterEach(() => {
        db.close();
    })

    it('get bookingRoom is not null', async () => {
        const booking = await BookRoomRepository.getBookingByRoomIdAndStartDate(roomID, startDate);
        expect(booking).to.have.property('id');
    })

    it('get bookingRoom is null', async () => {
        const booking = await BookRoomRepository.getBookingByRoomIdAndStartDate(roomID, 1);
        should().not.exist(booking);
    })

    it('insert BookingRoom is successfully', async () => {
        const result = await BookRoomRepository.insertBookingRoom(booking);    
        expect(result).to.have.property('id');
    })
})

