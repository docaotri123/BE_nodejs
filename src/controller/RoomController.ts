import { JsonController, Get, Post, Put } from 'routing-controllers';
import { ResponseObj } from '../model/response';
import { checkPermission } from '../middleware/Authorizer';
import { ROLE } from '../constant';


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
        @checkPermission([ROLE.ADMIN]) permission
    ) {

        try {
            if (!permission.allow && !permission.user) {
                return new ResponseObj(400, 'Token expired');
            }

            if (!permission.allow && permission.user) {
                return new ResponseObj(401, 'Not authorizer');
            }
            
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
