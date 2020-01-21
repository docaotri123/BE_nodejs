import { JsonController, Body, Post, Param, Put, Res } from 'routing-controllers';
import { BookRoomModel } from '../../model/BookRoomModel';
import { ResSuccess } from '../../model/ResponseModel';
import { checkPermission } from '../../middleware/Authorizer';
import { ROLE } from '../../constant';
import { BookRoomService } from '../../service/v1.0/BookRoomService';
import Common from '../../util/Common';
import { PermissionModel } from '../../model/PermissionModel';
import { ResError } from '../../model/ResError';
import { Response } from 'express';

@JsonController('/v1.0/booking')
export class BookRoomController {

    @Post('/rooms/status')
    async getStatusBookingRoom(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission: PermissionModel,
        @Body() body: any,
        @Res() res: Response) {
        const allow = Common.getPermission(permission);

        if (allow.error) {
            res.status(allow.code);
            return new ResError(allow.error);
        }

        const bookingInstance = BookRoomService.getInstance();
        const {code, mess, data, error } = await bookingInstance.handleGetStatusBookings(body.userId);
        res.status(code);

        if (error) {
            return new ResError(error);
        }

        return new ResSuccess(mess, data);
    }

    @Post('/rooms/available-days')
    async getAvailableRoom(
        @Body() body: any,
        @Res() res: Response) {

        const bookingInstance = BookRoomService.getInstance();
        const {code, mess, data, error } = await bookingInstance.handleGetStatusBookings(body.time);
        res.status(code);

        if (error) {
            return new ResError(error);
        }

        return new ResSuccess(mess, data);
    }

    @Post('/room')
    async bookRoom(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission: PermissionModel,
        @Body() bookingsBody: BookRoomModel,
        @Res() res: Response) {
        const allow = Common.getPermission(permission);

        if (allow.error) {
            res.status(allow.code);
            return new ResSuccess(allow.mess);
        }

        const bookingInstance = BookRoomService.getInstance();
        const {code, mess, error } = await bookingInstance.handleBookingRooms([bookingsBody])
        res.status(code);

        if (error) {
            return new ResError(mess);
        }

        return new ResSuccess(mess);
    }

    @Put('/room/:id/cancel')
    async cancelRoom(
        @Param('id') bookingId: number,
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Res() res: Response) {
        const allow = Common.getPermission(permission);

        if (allow.error) {
            res.status(allow.code);
            return new ResError(allow.error);
        }

        const bookingInstance = BookRoomService.getInstance();
        const { code, mess, error } = await bookingInstance.handleCancelBookingById(bookingId);
        res.status(code);

        if (error) {
            return new ResError(error);
        }

        return new ResSuccess(mess);
    }

    @Post('/rooms/available-times')
    async getAvailableRoomTime(
        @Body() body: any,
        @Res() res: Response) {
        const bookingInstance = BookRoomService.getInstance();
        const {code, mess, error ,data } = await bookingInstance.getAvailableRoomsByTime(body);
        res.status(code);

        if (error) {
            return new ResError(error);
        }

        return new ResSuccess(mess, data);
    }

    @Post('/rooms')
    async bookingRooms(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() roomsBody: BookRoomModel[],
        @Res() res: Response) {
        const allow = Common.getPermission(permission);

        if (allow.error) {
            res.status(allow.code);
            return new ResError(allow.error);
        }

        const bookingInstance = BookRoomService.getInstance();
        const {code, mess, error } = await bookingInstance.handleBookingRooms(roomsBody)
        res.status(code);

        if (error) {
            return new ResError(error);
        }

        return new ResSuccess(mess);
    }
}
