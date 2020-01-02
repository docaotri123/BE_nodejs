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
import { BookingService } from '../service/BookingService';

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

            const today = MomentDateTime.getCurrentDate();

            const groups: any = await getConnection()
                .createQueryBuilder()
                .select('g.id')
                .from(GroupBooking, 'g')
                .leftJoin('g.user', 'u')
                .where('u.id = :id AND g.endDate >= :today',{ id: user.userId, today: today })
                .getMany();
            
            const length = groups.length;
            const results = [];

            for (let i = 0; i < length; i++) {
                const group = groups[i];
                const temps = await getConnection()
                    .createQueryBuilder()
                    .select('t')
                    .addSelect('room.id')
                    .from(TempBookRoom, 't')
                    .where('t.groupId = :groupId', {groupId: group.id})
                    .leftJoin('t.room', 'room')
                    .getMany();
                
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

            const rooms = await getConnection().createQueryBuilder()
                .select('r')
                .from(Room, 'r')
                .getMany();

            const booksByDay = await getConnection().createQueryBuilder()
                .select('br')
                .from(BookRoom, 'br')
                .where('br.startDate <= :startDay AND br.endDate >= :startDay AND isCancelled = :isCancelled')
                .leftJoinAndMapOne('br.room', 'Room', 'r', 'r.id = br.roomId')
                .setParameters({startDay: startDay, isCancelled: false})
                .getMany();

            const results = rooms.filter(room => {
                return !booksByDay.find(book => book.room.id === room.id);
            });

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
        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }
    
            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }
            const booking = BookingsBody;
            const user = await getConnection().manager.findOne(User, { id: booking.userId });
            if (!user) {
                return new ResponseObj(400, 'User is not exists');
            }

            const group = new GroupBooking();
            group.user = user;
            group.startDate = MomentDateTime.getDateUtc(booking.startDate);
            group.endDate = MomentDateTime.getDateUtc(booking.endDate);
            
            const groupResult = await getConnection().manager.save(group);

            const tempBooking = new TempBookRoom();
            const room = await getConnection().manager.findOne(Room, { id: booking.roomID });
            tempBooking.startDate = MomentDateTime.getDateUtc(booking.startDate);
            tempBooking.endDate = MomentDateTime.getDateUtc(booking.endDate);
            tempBooking.status = BOOKING.PENDING;
            tempBooking.group = await getConnection().manager.findOne(GroupBooking, { id: groupResult.id });
            tempBooking.room = room;

            if (!tempBooking.room) {
                return new ResponseObj(400, 'Room is not exists');
            }

            const tempBookingResult = await getConnection().manager.save(tempBooking);

            const itemQueue = new BookingQueueModel();
            itemQueue.dataAPI = [BookingsBody];
            itemQueue.groupId = groupResult.id;
            itemQueue.tempBookingIds = [tempBookingResult.id];

            await startPublisher(itemQueue);

            return new ResponseObj(200, 'Booing Room is pending');
        } catch (err) {
            console.log(err);
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
            const room = await getConnection().manager.findOne(BookRoom, {id: idBooking});
            const today = MomentDateTime.getCurrentDate();

            if (today >= room.startDate) {
                return new ResponseObj(402, 'startDate greater today ! can not cancel room');
            }

            await getConnection()
                .createQueryBuilder()
                .update(BookRoom)
                .set({ isCancelled: true })
                .where('id = :id', { id: idBooking })
                .execute();
            
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

            const rooms = await getConnection().createQueryBuilder()
                .select('r')
                .from(Room, 'r')
                .getMany();

            const booksByTime = await getConnection().createQueryBuilder()
                .select('br')
                .from(BookRoom, 'br')
                .where(`br.startDate >= :startTime AND br.startDate <= :endTime
                OR br.startDate <= :startTime AND br.endDate >= :endTime
                OR br.endDate >= :startTime AND br.endDate <= :endTime
                OR br.startDate >= :startTime AND br.endDate <= :endTime
                AND isCancelled = :isCancelled`)
                .leftJoinAndMapOne('br.room', 'Room', 'r', 'r.id = br.roomId')
                .setParameters({ startTime: startTime, endTime: endTime, isCancelled: false })
                .getMany();
            
            
            const results = rooms.filter(room => {
                return !booksByTime.find(book => book.room.id === room.id);
            });

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
        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }
    
            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }
            // create group
            const user = await getConnection().manager.findOne(User, { id: roomsBody[0].userId });
            if (!user) {
                return new ResponseObj(400, 'User is not exists');
            }
            const group = new GroupBooking();
            group.user = user;
            const min = BookingService.minStartDate(roomsBody).startDate;
            const max = BookingService.maxEndDate(roomsBody).endDate;            
            group.startDate = MomentDateTime.getDateUtc(min);
            group.endDate = MomentDateTime.getDateUtc(max);
            const groupResult = await getConnection().manager.save(group);
       
            // create tempBooking and push queue
            const length = roomsBody.length;
            const temps = [];
            for (let i = 0; i < length; i++) {
                const room = roomsBody[i];
                const tempBooking = new TempBookRoom();
                tempBooking.startDate = MomentDateTime.getDateUtc(room.startDate);
                tempBooking.endDate = MomentDateTime.getDateUtc(room.endDate);
                tempBooking.status = BOOKING.PENDING;
                tempBooking.group = await getConnection().manager.findOne(GroupBooking, { id: groupResult.id });
                tempBooking.room = await getConnection().manager.findOne(Room, { id: room.roomID });

                const tempBookingResult = await getConnection().manager.save(tempBooking);
                temps.push(tempBookingResult.id);
            }

            const itemQueue = new BookingQueueModel();
            itemQueue.dataAPI = roomsBody;
            itemQueue.groupId = groupResult.id;
            itemQueue.tempBookingIds = temps;

            await startPublisher(itemQueue);
            

            return new ResponseObj(201, 'Booking rooms is pending');
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }
}
