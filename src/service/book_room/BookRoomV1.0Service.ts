import { getConnection } from "typeorm";
import { MomentDateTime } from "../../util/DateTimeUTC";
import { BookRoom } from "../../entity/BookRoom";
import { BookingQueueModel } from "../../model/BookingQueue";
import { TempBookingRepository } from "../../repository/temp_booking/TempBookingV1.0Repository";
import { GroupBookingRepository } from "../../repository/group/GroupV1.0Repository";
import { BookRoomModel } from "../../model/BookRoomModel";
import { GroupBooking } from "../../entity/GroupBooking";
import { TempBookRoom } from "../../entity/TempBookRoom";
import { startPublisher } from "../../job_queue/publisher";
import { HandleObj } from "../../model/HandleModel";
import { UserRepository } from "../../repository/user/UserV1.0Repository";
import { EntityMap } from "../../map/EntityMap";
import { RoomRepository } from "../../repository/room/RoomV1.0Repository";
import { BookRoomRepository } from "../../repository/book_room/BookRoomV1.0Repository";
import Common from "../../util/Common";


export class BookRoomService {

    private static instance: BookRoomService;

    private constructor() { }

    public static getInstance(): BookRoomService {
        if (!BookRoomService.instance) {
            BookRoomService.instance = new BookRoomService();
        }

        return BookRoomService.instance;
    }

    public async handleBookingRooms(bookings: BookRoomModel[]) {
        const connection = getConnection();
        const transaction = connection.createQueryRunner();
        try {
            const userRepo = UserRepository.getInstance();
            const roomRepo = RoomRepository.getInstance();
             // create group
             const user = await userRepo.getUserById(bookings[0].userId);
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
                 const room = await roomRepo.getRoomById(booking.roomID);
                 const tempBooking = new TempBookRoom();
                 EntityMap.mapTempBookingEntity(tempBooking, booking, groupResult, room);
                 const tempResult = await transaction.manager.save(tempBooking);
                 temps.push(tempResult.id);
             }

             await transaction.commitTransaction();
             await transaction.release();

             const itemQueue = new BookingQueueModel(bookings, groupResult.id, temps);
             await startPublisher(itemQueue);

            return new HandleObj(true, 201,'bookings is pending');
        } catch (err) {
            console.log(err);
            await transaction.rollbackTransaction();
            return new HandleObj(false, err);
        }
    }

    public async handleGetStatusBookings(userId: string) {
        try {
            const userRepo = UserRepository.getInstance();
            const tempRepo = TempBookingRepository.getInstance();
            const user = await userRepo.getUserById(userId);

            if (!user) {
                return new HandleObj(false, 402, 'User not found');
            }

            const groups = await GroupBookingRepository.getGroupBookingByUser(userId);
            const length = groups.length;
            const results = [];

            for (let i = 0; i < length; i++) {
                const group = groups[i];
                const temps = await tempRepo.getStatusTempBookingByGroup(group);
                results.push(temps);
            }

            return new HandleObj(true, 200, 'get status booking', results);
        } catch (err) {
            console.log(err);
            return new HandleObj(false, err);
        }
    }

    public async handleGetAvailableRoomsByDay(timestamp: number) {
        const bookingRepo = BookRoomRepository.getInstance();
        const roomRepo = RoomRepository.getInstance();
        try {
            const startDay = MomentDateTime.startSpecificDayUtc(timestamp);
            const rooms = await roomRepo.getRooms();
            const booksByDay = await bookingRepo.getBookingByDays(startDay);
            const results = roomRepo.getRoomsNotBooking(rooms, booksByDay);
            return new HandleObj(true, 200, 'get available is successfully', results);
        } catch(err) {
            console.log(err);
            return new HandleObj(false, err);
        }
    }

    public async getAvailableRoomsByTime(body) {
        const bookingRepo = BookRoomRepository.getInstance();
        const roomRepo = RoomRepository.getInstance();
        try {
            const startTime = MomentDateTime.getDateUtc(body.startTime);
            const endTime = MomentDateTime.getDateUtc(body.endTime);
            const rooms = await roomRepo.getRooms();
            const booksByTime = await bookingRepo.getBookingByTimes(startTime, endTime);
            const results = roomRepo.getRoomsNotBooking(rooms, booksByTime);

            return new HandleObj(true, 200, 'get available is successfully', results);
        } catch(err) {
            console.log(err);
            return new HandleObj(false, err);
        }
    }

    public async handleCancelBookingById(bookingId: number) {
        try {
            await getConnection()
                .createQueryBuilder()
                .update(BookRoom)
                .set({ isCancelled: true })
                .where('id = :id', { id: bookingId })
                .execute();
            return new HandleObj(true, 201, 'cancel booking is successfully');
        } catch (err) {
            console.log(err);
            return new HandleObj(false, err);
        }
    }

}
