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
import Common from "../util/Common";

export class BookRoomService {

    public static async bookingRooms(bookings: BookRoomModel[]) {
        const connection = getConnection();
        const transaction = connection.createQueryRunner();
        try {
            const userInstance = UserService.getInstance();
            const roomInstance = RoomService.getInstance();
             // create group
             const user = await userInstance.getUserById(bookings[0].userId);
             const min = Common.minStartDate(bookings).startDate;
             const max = Common.maxEndDate(bookings).endDate;

             const group = new GroupBooking();
             group.user = user;
             group.startDate = MomentDateTime.getDateUtc(min);
             group.endDate = MomentDateTime.getDateUtc(max);
             await transaction.startTransaction();
             const groupResult = await transaction.manager.save(group);
 
             // create tempBooking and push queue
             const length = bookings.length;
             const temps = [];
             for (let i = 0; i < length; i++) {
                 const booking = bookings[i];
                 const room = await roomInstance.getRoomById(booking.roomID);
                 const tempBooking = new TempBookRoom();
                 TempBookingService.mapTempBookingEntity(tempBooking, booking, groupResult, room);
                 const tempResult = await transaction.manager.save(tempBooking);
                 temps.push(tempResult.id);
             }

             await transaction.commitTransaction();
             await transaction.release();

             const itemQueue = new BookingQueueModel(bookings, groupResult.id, temps);
             await startPublisher(itemQueue);

            return new HandleObj(true, 201);
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
            return new HandleObj(false,err);
        }
    }

    public static async availableRoomsByDay(timestamp: number) {
        const roomInstance = RoomService.getInstance();
        try {
            const startDay = MomentDateTime.startSpecificDayUtc(timestamp);
            const rooms = await roomInstance.getRooms();
            const booksByDay = await BookRoomService.getBookingByDays(startDay);
            const results = roomInstance.getRoomsNotBooking(rooms, booksByDay);
            return new HandleObj(true, null, results);
        } catch(err) {
            console.log(err);
            return new HandleObj(false, err);
        }
    }

    public static async availableRoomsByTime(body) {
        const roomInstance = RoomService.getInstance();
        try {
            const startTime = MomentDateTime.getDateUtc(body.startTime);
            const endTime = MomentDateTime.getDateUtc(body.endTime);
            const rooms = await roomInstance.getRooms();
            const booksByTime = await BookRoomService.getBookingByTimes(startTime, endTime);
            const results = roomInstance.getRoomsNotBooking(rooms, booksByTime);
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
            return new HandleObj(true, 201);
        } catch (err) {
            console.log(err);
            return new HandleObj(false, err);
        }
    }

    public static async handleBookingRooms(itemQueue: BookingQueueModel) {
        try {
            const roomInstance = RoomService.getInstance();
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
                    const room = await roomInstance.getRoomById(bookings[i].roomID);
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
            .where('br.roomId = :roomId AND br.startDate <= :startDate AND br.endDate >= :startDate')
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
