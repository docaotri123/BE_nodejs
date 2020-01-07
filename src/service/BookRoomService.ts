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
import { UserService } from "./UserService";
import { TempBookRoom } from "../entity/TempBookRoom";
import { startPublisher } from "../job_queue/publisher";
import { HandleObj } from "../model/HandleModel";

export class BookRoomService {

    public static async bookingRoom(booking) {
        const connection = getConnection();
        const transaction = connection.createQueryRunner();
        try {
            const user = await UserService.getUserById(booking.userId);
            const room = await RoomService.getRoomById(booking.roomID);
            
           
            await transaction.connect();
            await transaction.startTransaction();
            const group = new GroupBooking();
            GroupBookingService.mapGroupEntity(group, booking, user);
            const groupResult = await transaction.manager.save(group);

            const tempBooking = new TempBookRoom();
            TempBookingService.mapTempBookingEntity(tempBooking, booking, groupResult, room);
            const tempBookingResult = await transaction.manager.save(tempBooking);
            await transaction.commitTransaction();
            await transaction.release();

            const itemQueue = new BookingQueueModel();
            itemQueue.dataAPI = [booking];
            itemQueue.groupId = groupResult.id;
            itemQueue.tempBookingIds = [tempBookingResult.id];

            await startPublisher(itemQueue);
            return new HandleObj(true);
        } catch (err) {
            console.log(err);
            await transaction.rollbackTransaction();
            return new HandleObj(false, err);
        }
    }

    public static async statusBookings(userId: string) {
        try {
            const groups = await GroupBookingService.getGroupBookingByUser(userId);
            const length = groups.length;
            const results = [];

            for (let i = 0; i < length; i++) {
                const group = groups[i];
                const temps = await TempBookingService.getStatusTempBookingByGroup(group);
                results.push(temps);
            }
            return new HandleObj(true,null,results);
        } catch(err) {
            console.log(err);
            return new HandleObj(true,err);
        }
    }

    public static async availableRoomsByDay(timestamp: number) {
        try {
            const startDay = MomentDateTime.startSpecificDayUtc(timestamp);
            const rooms = await RoomService.getRooms();
            const booksByDay = await BookRoomService.getBookingByDays(startDay);
            const results = RoomService.getRoomsNotBooking(rooms, booksByDay);
            return new HandleObj(true, null, results);
        } catch(err) {
            console.log(err);
            return new HandleObj(false, err);
        }
    }

    public static async availableRoomsByTime(body) {
        try {
            const startTime = MomentDateTime.getDateUtc(body.startTime);
            const endTime = MomentDateTime.getDateUtc(body.endTime);
            const rooms = await RoomService.getRooms();
            const booksByTime = await BookRoomService.getBookingByTimes(startTime, endTime);
            const results = RoomService.getRoomsNotBooking(rooms, booksByTime);
            return new HandleObj(true, null, results);
        } catch(err) {
            console.log(err);
            return new HandleObj(false, err);
        }
    }

    public static async cancelRoomById(bookingId: number) {
        try {
            await getConnection()
                .createQueryBuilder()
                .update(BookRoom)
                .set({ isCancelled: true })
                .where('id = :id', { id: bookingId })
                .execute();
            return new HandleObj(true);
        } catch (err) {
            console.log(err);
            return new HandleObj(false, err);
        }
    }

    public static async handleBookingRoom(itemQueue: BookingQueueModel) {
        try {
            const bookings = itemQueue.dataAPI;
            const tempBookingIds = itemQueue.tempBookingIds;
            const length = bookings.length;
            let flag = true;
            // find tempBooking and update
            for (let i = 0; i < length; i++) {
                const booking = bookings[i];
                const isBooked = await BookRoomService.getBookingByRoomIdAndStartDate(booking.roomID, booking.startDate);
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

                    await BookRoomService.insertBookingRoom(bookRoom);
                }
            }
            return true;
        } catch (err) {
            console.log('handle booking error');
            console.log(err);
            return false;
        }
    }

    public static async checkStartGreaterToday(bookingId: number) {
        try {
            const room = await BookRoomService.getBookingById(bookingId);
            const today = MomentDateTime.getCurrentDate();
            return today >= room.startDate
        } catch(err) {
            return false;
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

    public static getRandomBooking() {
        return getConnection().createQueryBuilder()
            .select('br.id')
            .from(BookRoom, 'br')
            .where('isCancelled = :isCancelled', {isCancelled: false})
            .getOne();
    }

    public static getBookingById(bookingId: number) {
        return getConnection().manager.findOne(BookRoom, {id: bookingId, isCancelled: false});
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

}
