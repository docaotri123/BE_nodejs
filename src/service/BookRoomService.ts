import { getConnection } from "typeorm";
import { MomentDateTime } from "../util/DateTimeUTC";
import { BookRoom } from "../entity/BookRoom";
import { BOOKING } from "../constant";
import { BookingQueueModel } from "../model/BookingQueue";
import { TempBookingService } from "./TempBookingService";
import { GroupBookingService } from "./GroupBookingService";
import { RoomService } from "./RoomService";
import { BookRoomModel } from "../model/BookRoomModel";
import { GroupBooking } from "../entity/GroupBooking";
import { User } from "../entity/User";

export class BookRoomService {

    public static async handleBookingRoom(itemQueue: BookingQueueModel) {
        const bookings = itemQueue.dataAPI;
        const tempBookingIds = itemQueue.tempBookingIds;
        const length = bookings.length;
        let flag = true;
        // find tempBooking and update
        for (let i = 0; i < length; i++) {
            const booking = bookings[i];
            const isBooked = await this.getBookingByRoomIdAndStartDate(booking.roomID, booking.startDate);
            if (isBooked) {
                flag = false;
            }
            const statusBooking = isBooked ? BOOKING.BOOKED : BOOKING.SUCCESS;
            await TempBookingService.updateStatusTempBooking(tempBookingIds[i], statusBooking);
        }

        // add booking_room
        if (flag) {
            const group = await GroupBookingService.getGroupById(itemQueue.groupId);
            for (let i = 0; i < length; i++) {
                const room = await RoomService.getRoomById(bookings[i].roomID);
                const bookRoom = new BookRoom();
                bookRoom.startDate = MomentDateTime.getDateUtc(bookings[i].startDate);
                bookRoom.endDate = MomentDateTime.getDateUtc(bookings[i].endDate);
                bookRoom.group = group;
                bookRoom.room = room;

                await this.insertBookingRoom(bookRoom);
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

    public static getBookingById(bookingId: number) {
        return getConnection().manager.findOne(BookRoom, {id: bookingId});
    }

    public static getBookingByRoomIdAndStartDate(roomID: number, startDate: number) {
        const _startDate = MomentDateTime.getDateUtc(startDate);    
        return getConnection()
        .createQueryBuilder()
        .select('br.id')
        .from(BookRoom, 'br')
        .where('br.startDate <= :startDate AND br.endDate >= :startDate AND br.roomId = :roomId')
        .setParameters({ roomId: roomID, startDate: _startDate })
        .getOne();
    }

    public static getBookingByTimes(startDate: Date, endDate: Date) {
        return getConnection().createQueryBuilder()
            .select('br')
            .from(BookRoom, 'br')
            .where(`br.startDate >= :startTime AND br.startDate <= :endTime
                OR br.startDate <= :startTime AND br.endDate >= :endTime
                OR br.endDate >= :startTime AND br.endDate <= :endTime
                OR br.startDate >= :startTime AND br.endDate <= :endTime
                AND isCancelled = :isCancelled`)
            .leftJoinAndMapOne('br.room', 'Room', 'r', 'r.id = br.roomId')
            .setParameters({ startTime: startDate, endTime: endDate, isCancelled: false })
            .getMany();
    }

    public static getBookingByDays(startDate: Date) {
        return getConnection().createQueryBuilder()
            .select('br')
            .from(BookRoom, 'br')
            .where('br.startDate <= :startDay AND br.endDate >= :startDay AND isCancelled = :isCancelled')
            .leftJoinAndMapOne('br.room', 'Room', 'r', 'r.id = br.roomId')
            .setParameters({ startDay: startDate, isCancelled: false })
            .getMany();
    }

    public static insertBookingRoom(booking: BookRoom) {
        return getConnection().manager.save(booking);
    }

    public static deleteBooking(bookingId: number) {
        return getConnection()
            .createQueryBuilder()
            .update(BookRoom)
            .set({ isCancelled: true })
            .where('id = :id', { id: bookingId })
            .execute();
    }

}
