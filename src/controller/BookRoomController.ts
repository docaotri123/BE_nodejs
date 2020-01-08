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
import { HandleObj } from '../model/HandleModel';

@JsonController()
export class BookRoomController {

    @Post('/statusbookingrooms')
    async getStatusBookingRoom(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() body: any) {
        if (!permission.allow && !permission.user) {
            return new ResponseObj(400, 'Token expired');
        }

        if (!permission.allow && permission.user) {
            return new ResponseObj(401, 'Not authorizer');
        }
        const userInstance = UserService.getInstance();

        const user = await userInstance.getUserById(body.userId);

        if(!user) {
            return new ResponseObj(402, 'User not found');
        }

        const handle: any = await BookRoomService.statusBookings(body.userId);

        if (!handle.status) {
            return new ResponseObj(500, handle.err);
        }
        return new ResponseObj(200, 'status booking rooms', handle.data);
    }

    @Post('/availableroomsday')
    async getAvailableRoom(@Body() body: any) {
        const handle: any = BookRoomService.availableRoomsByDay(body.time);
        if (!handle.status) {
            return new ResponseObj(500, handle.err); 
        }
        return new ResponseObj(200, handle.data);
    }

    @Post('/bookingroom')
    async bookRoom(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() BookingsBody: BookRoomModel) {
        if (!permission.allow && !permission.user) {
            return new ResponseObj(400, 'Token expired');
        }

        if (!permission.allow && permission.user) {
            return new ResponseObj(401, 'Not authorizer');
        }
        const handle: any = await BookRoomService.bookingRooms([BookingsBody]);

        if (!handle.status) {
            return new ResponseObj(500, handle.err);
        }
        return new ResponseObj(200, 'Booing Room is pending');
    }

    @Put('/cancelroom/:id')
    async cancelRoom(
        @Param('id') bookingId: number,
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission) {
        if (!permission.allow && !permission.user) {
            return new ResponseObj(400, 'Token expired');
        }

        if (!permission.allow && permission.user) {
            return new ResponseObj(401, 'Not authorizer');
        }

        const checkTime = await BookRoomService.checkStartGreaterToday(bookingId)

        if (checkTime) {
            return new ResponseObj(402, 'startDate greater today ! can not cancel room');
        }

        const handle: any = BookRoomService.cancelRoomById(bookingId);

        if (!handle.status) {
            return new ResponseObj(500, handle.err);
        }

        return new ResponseObj(200, 'Cancel room successfully');
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
        const handle: any = await BookRoomService.availableRoomsByTime(body);
        if (!handle.status) {
            return new ResponseObj(500, handle.err);
        }

        return new ResponseObj(200, 'available rooms in time', handle.data);
    }

    @Post('/bookingrooms')
    async bookingRooms(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() roomsBody: BookRoomModel[]) {
        if (!permission.allow && !permission.user) {
            return new ResponseObj(400, 'Token expired');
        }

        if (!permission.allow && permission.user) {
            return new ResponseObj(401, 'Not authorizer');
        }

        const handle: any = await BookRoomService.bookingRooms(roomsBody);

        if (!handle.status) {
            return new ResponseObj(500, handle.err);
        }

        return new ResponseObj(201, 'Booking rooms is pending');
    }
}
