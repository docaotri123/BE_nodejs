import { JsonController, Get, Post, Put, Body, Param, Delete } from 'routing-controllers';
import { ResponseObj } from '../model/ResponseModel';
import { checkPermission } from '../middleware/Authorizer';
import { ROLE } from '../constant';
import { RoomModel } from '../model/RoomModel';
import { RoomService } from '../service/RoomService';
import Common from '../util/Common';
import { PermissionModel } from '../model/PermissionModel';


@JsonController()
export class RoomController {

    @Get('/rooms')
    async ListRoom(
        @checkPermission([ROLE.ADMIN]) permission: PermissionModel) {
        const allow = Common.getPermission(permission);

        if(!allow.status) {
            return new ResponseObj(allow.code, allow.mess);
        }

        const roomInstance = RoomService.getInstance();
        const {status, code, mess, data } = await roomInstance.handleGetRooms();

        if (!status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess, data);
    }

    @Post('/room')
    async CreateRoom(
        @checkPermission([ROLE.ADMIN]) permission: PermissionModel,
        @Body() roomModel: RoomModel) {
        const allow = Common.getPermission(permission);

        if (!allow.status) {
            return new ResponseObj(allow.code, allow.mess);
        }

        const roomInstance = RoomService.getInstance();
        const { status, code, mess, data } = await roomInstance.handleInsertRoom(roomModel);

        if (!status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess, data);
    }

    @Put('/room/:id')
    async EditRoom(
        @checkPermission([ROLE.ADMIN]) permission: PermissionModel
    ) {
        const allow = Common.getPermission(permission);

        if (!allow.status) {
            return new ResponseObj(allow.code, allow.mess);
        }
    }

    @Delete('/room/:id')
    async DeleteRoom(
        @Param('id') id: number,
        @checkPermission([ROLE.ADMIN]) permission: PermissionModel
    ) {
        const allow = Common.getPermission(permission);

        if (!allow.status) {
            return new ResponseObj(allow.code, allow.mess);
        }

        const roomInstance = RoomService.getInstance();
        const { status, code, mess, data } = await roomInstance.deleteRoom(id);

        if (!status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess, data);
    }

}
