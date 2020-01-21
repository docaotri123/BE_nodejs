import { JsonController, Get, Post, Body, Param, Delete, Res } from 'routing-controllers';
import { ResSuccess } from '../../model/ResponseModel';
import { checkPermission } from '../../middleware/Authorizer';
import { ROLE } from '../../constant';
import { RoomModel } from '../../model/RoomModel';
import { RoomService } from '../../service/v1.0/RoomService';
import { PermissionModel } from '../../model/PermissionModel';
import Common from '../../util/Common';
import { Response } from 'express';
import { ResError } from '../../model/ResError';


@JsonController('/v1.0/room-management')
export class RoomController {

    @Get('/rooms')
    async ListRoom(
        @checkPermission([ROLE.ADMIN]) permission: PermissionModel,
        @Res() res: Response) {        
        const allow = Common.getPermission(permission);
        
        if(!allow.error) {
            res.status(allow.code);
            return new ResError(allow.error);
        }

        const roomInstance = RoomService.getInstance();
        const {code, mess, data, error } = await roomInstance.handleGetRooms();
        res.status(code);

        if (error) {
            return new ResError(error);
        }

        return new ResSuccess(mess, data);
    }

    @Post('/room')
    async CreateRoom(
        @checkPermission([ROLE.ADMIN]) permission: PermissionModel,
        @Body() roomModel: RoomModel,
        @Res() res: Response) {
        const allow = Common.getPermission(permission);

        if (allow.error) {
            res.status(allow.code);
            return new ResError(allow.error);
        }

        const roomInstance = RoomService.getInstance();
        const { code, mess, error } = await roomInstance.handleInsertRoom(roomModel);
        res.status(code);

        if (error) {
            return new ResError(mess);
        }

        return new ResSuccess(mess);
    }

    @Delete('/room/:id')
    async DeleteRoom(
        @Param('id') id: number,
        @checkPermission([ROLE.ADMIN]) permission: PermissionModel,
        @Res() res: Response) {
        const allow = Common.getPermission(permission);

        if (allow.error) {
            res.status(allow.code);
            return new ResSuccess(allow.mess);
        }

        const roomInstance = RoomService.getInstance();
        const { code, mess, error } = await roomInstance.handleDeleteRoom(id);

        if (error) {
            return new ResError(error);
        }

        return new ResSuccess(mess);
    }

}
