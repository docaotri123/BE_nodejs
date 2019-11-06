import { JsonController, Get, Post, Put, Body } from 'routing-controllers';
import { ResponseObj } from '../model/response';
import { checkPermission } from '../middleware/Authorizer';
import { ROLE } from '../constant';
import { RoomModel } from '../model/RoomModel';
import { Room } from '../entity/Room';
import { getConnection } from 'typeorm';
import { Type } from '../entity/Type';


@JsonController()
export class RoomController {
    @Get('/rooms')
    async ListRoom() {
        try {
            return new ResponseObj(200, 'get list rooms successfully');
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Post('/room')
    async CreateRoom(
        @checkPermission([ROLE.ADMIN]) permission,
        @Body() roomModel: RoomModel
    ) {

        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }

            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }
            const room = new Room();
            room.description = roomModel.description;
            room.imageURL = roomModel.image;
            room.quality = roomModel.quality;
            room.price = roomModel.price;
            const type = await getConnection().manager.findOne(Type, {type: roomModel.type});
            if (!type) {
                return new ResponseObj(400, 'Type room is not exits');
            }
            room.type = type;

            await getConnection().manager.save(room);
            
            return new ResponseObj(200, 'Create room successfully');
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Put('/room/:id')
    async EditRoom() {
        try {
            return new ResponseObj(200, 'Edit room successfully');
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Put('/room/:id')
    async DeleteRoom() {
        try {
            return new ResponseObj(200, 'Delete room successfully');
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

}
