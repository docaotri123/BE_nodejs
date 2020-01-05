import { JsonController, Body, Post, Param, Get, Put } from 'routing-controllers';
import { BookRoomModel } from '../model/BookRoomModel';
import { ResponseObj } from '../model/response';
import { checkPermission } from '../middleware/Authorizer';
import { ROLE, BOOKING } from '../constant';
import { Room } from '../entity/Room';
import { MomentDateTime } from '../util/DateTimeUTC';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import { BookRoom } from '../entity/BookRoom';
import { startPublisher } from '../job_queue/publisher';
import { TempBookRoom } from '../entity/TempBookRoom';
import { BookingQueueModel } from '../model/BookingQueue';
import { GroupBooking } from '../entity/GroupBooking';
import { BookRoomService } from '../service/BookRoomService';
import { RoomService } from '../service/RoomService';
import { UserService } from '../service/UserService';
import { TempBookingService } from '../service/TempBookingService';
import { GroupBookingService } from '../service/GroupBookingService';

@JsonController()
export class BookRoomController {

    @Post('/statusbookingrooms')
    async getStatusBookingRoom(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() user: any) {
        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }
    
            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }

            const groups = await GroupBookingService.getGroupBookingByUser(user.userId);
            const length = groups.length;
            const results = [];

            for (let i = 0; i < length; i++) {
                const group = groups[i];
                const temps = await TempBookingService.getStatusTempBookingByGroup(group);
                results.push(temps);
            }

            return new ResponseObj(200, 'status booking rooms', results);

        } catch(err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Post('/availableroomsday')
    async getAvailableRoom(@Body() body: any) {
        try {
            const startDay = MomentDateTime.startSpecificDayUtc(body.time);

            const rooms = await RoomService.getRooms();
            const booksByDay = await BookRoomService.getBookingByDays(startDay);
            const results = RoomService.getRoomsNotBooking(rooms, booksByDay);

            return new ResponseObj(200, 'okie', results);
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Post('/bookingroom')
    async bookRoom(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() BookingsBody: BookRoomModel) {
        const connection = getConnection();
        const transaction = connection.createQueryRunner();
        await transaction.connect();
        await transaction.startTransaction();
        try {
                        
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }
    
            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }
            const booking = BookingsBody;
            const user = await UserService.getUserById(booking.userId);
            const room = await RoomService.getRoomById(booking.roomID);

            const group = new GroupBooking();
            GroupBookingService.mapGroupEntity(group, booking, user);
            const groupResult = await transaction.manager.save(group);

            const tempBooking = new TempBookRoom();
            TempBookingService.mapTempBookingEntity(tempBooking, booking, groupResult, room);
            const tempBookingResult = await transaction.manager.save(tempBooking);

            const itemQueue = new BookingQueueModel();
            itemQueue.dataAPI = [BookingsBody];
            itemQueue.groupId = groupResult.id;
            itemQueue.tempBookingIds = [tempBookingResult.id];

            await startPublisher(itemQueue);
            await transaction.commitTransaction();
            await transaction.release();
            return new ResponseObj(200, 'Booing Room is pending');
           
        } catch (err) {
            console.log(err);
            await transaction.rollbackTransaction();
            return new ResponseObj(500, err);
        }
    }

    @Put('/cancelroom/:id')
    async cancelRoom(
        @Param('id') idBooking: number,
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission) {
        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }
    
            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }
            const room = await BookRoomService.getBookingById(idBooking);
            const today = MomentDateTime.getCurrentDate();

            if (today >= room.startDate) {
                return new ResponseObj(402, 'startDate greater today ! can not cancel room');
            }

            await BookRoomService.deleteBooking(idBooking);
            
            return new ResponseObj(200, 'Cancel room successfully');
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Put('/editbooking/:id')
    async editBooking(
        @Param('id') idBooking: number,
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission) {
        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }
    
            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }
            return new ResponseObj(201, 'Edit book room is successfully');
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Post('/availableroomstime')
    async getAvailableRoomTime(@Body() body: any) {
        try {
            const startTime = MomentDateTime.getDateUtc(body.startTime);
            const endTime = MomentDateTime.getDateUtc(body.endTime);
            const rooms = await RoomService.getRooms();
            const booksByTime = await BookRoomService.getBookingByTimes(startTime, endTime);
            const results = RoomService.getRoomsNotBooking(rooms, booksByTime);

            return new ResponseObj(200, 'available rooms in time', results);
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Post('/bookingrooms')
    async bookingRooms(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() roomsBody: any[]) {
        const connection = getConnection();
        const transaction = connection.createQueryRunner();
        await transaction.connect();
        await transaction.startTransaction();
        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }

            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }
            // create group
            const user = await UserService.getUserById(roomsBody[0].userId);
            const min = BookRoomService.minStartDate(roomsBody).startDate;
            const max = BookRoomService.maxEndDate(roomsBody).endDate;
            const group = new GroupBooking();
            group.user = user;
            group.startDate = MomentDateTime.getDateUtc(min);
            group.endDate = MomentDateTime.getDateUtc(max);
            const groupResult = await transaction.manager.save(group);

            // create tempBooking and push queue
            const length = roomsBody.length;
            const temps = [];
            for (let i = 0; i < length; i++) {
                const booking = roomsBody[i];
                const room = await RoomService.getRoomById(booking.roomID);
                const tempBooking = new TempBookRoom();
                TempBookingService.mapTempBookingEntity(tempBooking, booking, groupResult, room);
                const tempResult = await transaction.manager.save(tempBooking);
                temps.push(tempResult.id);
            }

            const itemQueue = new BookingQueueModel();
            itemQueue.dataAPI = roomsBody;
            itemQueue.groupId = groupResult.id;
            itemQueue.tempBookingIds = temps;

            await startPublisher(itemQueue);
            await transaction.commitTransaction();
            await transaction.release();

            return new ResponseObj(201, 'Booking rooms is pending');
        } catch (err) {
            console.log(err);
            await transaction.rollbackTransaction();
            return new ResponseObj(500, err);
        }
    }
}
