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

@JsonController()
export class BookRoomController {

    @Post('/availablerooms')
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
            console.log('hai');
            
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Post('/bookroom/:id')
    async bookRoom(
        @Param('id') id: number,
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() BRBody: BookRoomModel) {
        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }
    
            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }
            // check room and user exist
            const room = await getConnection().manager.findOne(Room, {id: id});
            const user = await getConnection().manager.findOne(User, { id: BRBody.userId });
            if (!room) {
                return new ResponseObj(400, 'Room is not exists');
            }
            if (!user) {
                return new ResponseObj(400, 'User is not exists');
            }
            // check book room
            const startDate = MomentDateTime.getDateUtc(BRBody.startDate);
            const endDate = MomentDateTime.getDateUtc(BRBody.endDate);
            
            const booking = await getConnection().createQueryBuilder()
                .select('br.id')
                .from(BookRoom, 'br')
                .where('br.startDate <= :startDate AND br.endDate >= :startDate AND roomId = :id')
                .setParameters({ id: id, startDate: startDate })
                .getOne();

            if (booking) {
                return new ResponseObj(400, 'Room have booked');
            }

            // save
            const bookRoom = new BookRoom();
            bookRoom.startDate = startDate;
            bookRoom.endDate = endDate;
            bookRoom.user = user;
            bookRoom.room = room;

            await getConnection().manager.save(bookRoom);

            return new ResponseObj(201, 'Booing Room is successfully');
            

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


}
