import { JsonController, Body, Post, Param, Get, Put } from 'routing-controllers';
import { BookRoomModel } from '../model/BookRoomModel';
import { ResponseObj } from '../model/response';
import { checkPermission } from '../middleware/Authorizer';
import { ROLE } from '../constant';
import { Room } from '../entity/Room';
import { MomentDateTime } from '../util/DateTimeUTC';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import { BookRoom } from '../entity/BookRoom';
import { startPublisher } from '../job_queue/publisher';

@JsonController()
export class BookRoomController {

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

            await startPublisher(BRBody);

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

    @Post('/bookrooms')
    async bookRooms(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() roomsBody: any[]) {
        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }
    
            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }

            if (!roomsBody.length) {
                return new ResponseObj(204, 'No Data');
            }
            // check booking
            const promiseRoomsBooking = roomsBody.map(room => {
                const startDate = MomentDateTime.getDateUtc(room.startDate);
                return this.getBooking(+room.roomId, startDate);
            });
            const roomsBooking = await Promise.all(promiseRoomsBooking);
            const arrIdRoomBooking = roomsBooking
                .filter(room => room)
                .map(room => room.room.id);
            if (arrIdRoomBooking.length) {
                return new ResponseObj(402, 'many rooms have booked!', arrIdRoomBooking);
            }

            // process save
            const user = await getConnection().manager.findOne(User, {id: roomsBody[0].userId});
            const promiseRooms = roomsBody.map( room => {
                return getConnection().manager.findOne(Room, {id: room.roomId});
            });
            const rooms = await Promise.all(promiseRooms);

            const promiseBookRooms = roomsBody.map( (room, index) => {
                const startDate = MomentDateTime.getDateUtc(room.startDate);
                const endDate = MomentDateTime.getDateUtc(room.endDate);
                const bookRoom = new BookRoom();
                bookRoom.startDate = startDate;
                bookRoom.endDate = endDate;
                bookRoom.user = user;
                bookRoom.room = rooms[index];

                return getConnection().manager.save(bookRoom);
            });
            
            await Promise.all(promiseBookRooms);
            
            return new ResponseObj(201, 'Booking rooms is successfully');
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
