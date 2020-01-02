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
import { BookRoomRepository } from '../repository/BookRoomRepository';
import { TempBookingRepository } from "../repository/TempBookingRepository";
import { GroupBookingRepository } from "../repository/GroupBookingRepository";
import { RoomRepository } from "../repository/RoomRepository";

export class BookingService {

    public static async handleBookingRoom(itemQueue: BookingQueueModel) {
        const bookings = itemQueue.dataAPI;
        const tempBookingIds = itemQueue.tempBookingIds;
        const length = bookings.length;
        let flag = true;
        // find tempBooking and update
        for (let i = 0; i < length; i++) {
            const booking = bookings[i];
            const isBooked = await BookRoomRepository.getBookingByRoomIdAndStartDate(booking.roomID, booking.startDate);
            if (isBooked) {
                flag = false;
            }
            const statusBooking = isBooked ? BOOKING.BOOKED : BOOKING.SUCCESS;
            await TempBookingRepository.updateStatusTempBooking(tempBookingIds[i], statusBooking);
        }

        // add booking_room
        if (flag) {
            const group = await GroupBookingRepository.getGroupById(itemQueue.groupId);
            for (let i = 0; i < length; i++) {
                const room = await RoomRepository.getRoomById(bookings[i].roomID);
                const bookRoom = new BookRoom();
                bookRoom.startDate = MomentDateTime.getDateUtc(bookings[i].startDate);
                bookRoom.endDate = MomentDateTime.getDateUtc(bookings[i].endDate);
                bookRoom.group = group;
                bookRoom.room = room;

                await BookRoomRepository.insertBookingRoom(bookRoom);
            }
        }
    }

    public static mapExistsInTwoArray(source: any[], destination: any[]) {
        return source.map((value, index) => {
            const isExists = destination[index] ? true : false;
            return { ...value, isExists: isExists };
        });
    }

    public static minStartDate(arr: any[]) {
        let min = arr[0];
        for (let i = 1; i < arr.length; i++) {
            const obj = arr[i];
            if (obj.startDate < min.startDate) {
                min = obj;
            }
        }
        return min;
    }

    public static maxEndDate(arr: any[]) {
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
            const obj = arr[i];
            if (obj.endDate > max.endDate) {
                max = obj;
            }
        }
        return max;
    }
}
