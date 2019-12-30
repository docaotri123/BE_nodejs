import { BookRoomModel } from "../model/BookRoomModel";
import { Room } from "../entity/Room";
import { User } from "../entity/User";
import { getConnection } from "typeorm";
import { MomentDateTime } from "../util/DateTimeUTC";
import { BookRoom } from "../entity/BookRoom";
import { BOOKING } from "../constant";
import { BookingQueueModel } from "../model/BookingQueue";
import { TempBookRoom } from "../entity/TempBookRoom";
import { GroupBooking } from "../entity/GroupBooking";

export const handleBookingRoom = async (itemQueue: BookingQueueModel) => {
    const bookings = itemQueue.dataAPI;
    const tempBookingIds = itemQueue.tempBookingIds;
    const length = bookings.length;
    let flag = true;
    // find tempBooking and update
    for (let i = 0; i < length; i++) {
        const booking = bookings[i];
        const isBooked = await checkBooking(booking);
        if (isBooked) {
            flag = false;
        }
        const statusBooking = isBooked ? BOOKING.BOOKED : BOOKING.SUCCESS;

        await getConnection().createQueryBuilder()
            .update(TempBookRoom)
            .set({ status: statusBooking })
            .where('id = :tempBookingId', { tempBookingId: tempBookingIds[i] })
            .execute();
    }

    // add booking_room
    if (flag) {
        const group = await getConnection().manager.findOne(GroupBooking, { id: itemQueue.groupId });
        for (let i = 0; i < length; i++) {
            const room = await getConnection().manager.findOne(Room, {id: bookings[i].roomID});
            const bookRoom = new BookRoom();
            bookRoom.startDate = MomentDateTime.getDateUtc(bookings[i].startDate);
            bookRoom.endDate = MomentDateTime.getDateUtc(bookings[i].endDate);
            bookRoom.group = group;
            bookRoom.room = room;
    
            await getConnection().manager.save(bookRoom);
        }
    }

}

export const mapExistsInTwoArray = (source: any[], destination: any[]) => {
    return source.map((value, index) => {
        const isExists = destination[index] ? true : false;
        return {... value, isExists: isExists};
    });
}

export const minStartDate = (arr: any[]) => {
    let min = arr[0];
    for (let i = 1; i < arr.length; i++) {
        const obj = arr[i];
        if (obj.startDate < min.startDate) {
            min = obj;
        }
    }
    return min;
}

export const maxEndDate = (arr: any[]) => {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        const obj = arr[i];
        if (obj.endDate > max.endDate) {
            max = obj;
        }
    }
    return max;
}

const checkBooking = async (BRModel: BookRoomModel) => {
    
    const startDate = MomentDateTime.getDateUtc(BRModel.startDate);    
    const booking = getConnection().createQueryBuilder()
    .select('br.id')
    .from(BookRoom, 'br')
    .where('br.startDate <= :startDate AND br.endDate >= :startDate AND br.roomId = :roomId')
    .setParameters({ roomId: BRModel.roomID, startDate: startDate })
    .getOne();

    return booking;
}