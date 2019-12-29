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
import { mapExistsInTwoArray } from '../service/BookingRoomService';

@JsonController()
export class BookRoomController {

    @Post('/statusbookingrooms')
    async getStatusBookingRoom(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() arrBody: BookRoomModel[]) {
        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }
    
            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }

            const arrStatus = [];
            for(let i = 0; i < arrBody.length; i++) {
                const item = arrBody[i];
                const startDate = MomentDateTime.getDateUtc(item.startDate);

                const tempBooking = await getConnection()
                .createQueryBuilder()
                .select("temp")
                .from(TempBookRoom, "temp")
                .where(`temp.userId = :userId AND
                    temp.roomId = :roomId AND
                    temp.startDate = :startDate`)
                .leftJoinAndMapOne('temp.room', 'Room', 'r', 'r.id = temp.roomId')
                .leftJoinAndMapOne('temp.user', 'User', 'u', 'u.id = temp.userId')
                .setParameters({
                    startDate: startDate,
                    roomId: item.roomID,
                    userId: item.userId,
                })
                .getOne();

                arrStatus.push(tempBooking);
            }

            return new ResponseObj(200, 'status booking rooms', arrStatus);

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
        @Body() BRBody: BookRoomModel) {
        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }
    
            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }

            const tempBooking = new TempBookRoom();
            const room = await getConnection().manager.findOne(Room, { id: BRBody.roomID });
            const user = await getConnection().manager.findOne(User, { id: BRBody.userId });
            tempBooking.startDate = MomentDateTime.getDateUtc(BRBody.startDate);
            tempBooking.endDate = MomentDateTime.getDateUtc(BRBody.endDate);
            tempBooking.status = BOOKING.PENDING;
            tempBooking.user = user;
            tempBooking.room = room;

            if (!tempBooking.room) {
                return new ResponseObj(400, 'Room is not exists');
            }
            if (!tempBooking.user) {
                return new ResponseObj(400, 'User is not exists');
            }

            const tempBookingResult = await getConnection().manager.save(tempBooking);

            const itemQueue = new BookingQueueModel();
            itemQueue.dataAPI = BRBody;
            itemQueue.tempBookingId = tempBookingResult.id;

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
            // check exists rooms and users
            const length = roomsBody.length;
            const roomsPromise = [];
            const usersPromise = [];
            for (let i = 0; i < length; i++) {
                const room = roomsBody[i];
                roomsPromise.push(getConnection().manager.findOne(Room, { id: room.roomID }))
                usersPromise.push(getConnection().manager.findOne(User, { id: room.userId }))
            }

            const rooms = await Promise.all(roomsPromise);
            const users = await Promise.all(usersPromise);

            if(rooms.some(room => !room)) {
                const results = mapExistsInTwoArray(roomsBody, rooms);
                return new ResponseObj(400, 'Many rooms have no exists', results);
            }

            if(users.some(user => !user)) {
                const results = mapExistsInTwoArray(roomsBody, users);
                return new ResponseObj(400, 'Many users have no exists', results);
            }
            // create tempBooking and push queue
            for (let i = 0; i < length; i++) {
                const room = roomsBody[i];
                const tempBooking = new TempBookRoom();
                tempBooking.startDate = MomentDateTime.getDateUtc(room.startDate);
                tempBooking.endDate = MomentDateTime.getDateUtc(room.endDate);
                tempBooking.status = BOOKING.PENDING;
                tempBooking.user = users[i];
                tempBooking.room = rooms[i];

                const tempBookingResult = await getConnection().manager.save(tempBooking);
                const itemQueue = new BookingQueueModel();
                itemQueue.dataAPI = room;
                itemQueue.tempBookingId = tempBookingResult.id;
    
                await startPublisher(itemQueue);
            }
            

            return new ResponseObj(201, 'Booking rooms is pending');
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    private getBooking(id: number, startDate: Date) {
        return getConnection().createQueryBuilder()
        .select('br.id')
        .from(BookRoom, 'br')
        .leftJoinAndMapOne('br.room', 'Room', 'r', 'r.id = br.roomId')
        .where('br.startDate <= :startDate AND br.endDate >= :startDate AND roomId = :id')
        .setParameters({ id: id, startDate: startDate })
        .getOne();
    }
}
