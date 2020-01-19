import { JsonController, Body, Post, Param, Put } from 'routing-controllers';
import { BookRoomModel } from '../../model/BookRoomModel';
import { ResponseObj } from '../../model/ResponseModel';
import { checkPermission } from '../../middleware/Authorizer';
import { ROLE } from '../../constant';
import { BookRoomService } from '../../service/book_room/BookRoomService';
import Common from '../../util/Common';
import { PermissionModel } from '../../model/PermissionModel';

@JsonController()
export class BookRoomController {

    @Post('/statusbookingrooms')
    async getStatusBookingRoom(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission: PermissionModel,
        @Body() body: any) {
        const allow = Common.getPermission(permission);

        if (!allow.status) {
            return new ResponseObj(allow.code, allow.mess);
        }

        const bookingInstance = BookRoomService.getInstance();
        const { status, code, mess, data } = await bookingInstance.handleGetStatusBookings(body.userId);

        if (!status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess, data);
    }

    @Post('/availableroomsday')
    async getAvailableRoom(@Body() body: any) {
        const bookingInstance = BookRoomService.getInstance();
        const { status, code, mess, data } = await bookingInstance.handleGetStatusBookings(body.time);

        if (!status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess, data);
    }

    @Post('/bookingroom')
    async bookRoom(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission: PermissionModel,
        @Body() bookingsBody: BookRoomModel) {
        const allow = Common.getPermission(permission);

        if (!allow.status) {
            return new ResponseObj(allow.code, allow.mess);
        }

        const bookingInstance = BookRoomService.getInstance();
        const { status, code, mess } = await bookingInstance.handleBookingRooms([bookingsBody])

        if (!status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess);
    }

    @Put('/cancelroom/:id')
    async cancelRoom(
        @Param('id') bookingId: number,
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission) {
        const allow = Common.getPermission(permission);

        if (!allow.status) {
            return new ResponseObj(allow.code, allow.mess);
        }

        const bookingInstance = BookRoomService.getInstance();
        const { status, code, mess } = await bookingInstance.handleCancelBookingById(bookingId);

        if (!status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess);
    }

    @Post('/availableroomstime')
    async getAvailableRoomTime(@Body() body: any) {
        const bookingInstance = BookRoomService.getInstance();
        const { status, code, mess, data } = await bookingInstance.getAvailableRoomsByTime(body);

        if (!status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess, data);
    }

    @Post('/bookingrooms')
    async bookingRooms(
        @checkPermission([ROLE.ADMIN, ROLE.CUSTOMER]) permission,
        @Body() roomsBody: BookRoomModel[]) {
        const allow = Common.getPermission(permission);

        if (!allow.status) {
            return new ResponseObj(allow.code, allow.mess);
        }

        const bookingInstance = BookRoomService.getInstance();
        const { status, code, mess } = await bookingInstance.handleBookingRooms(roomsBody)

        if (!status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess);
    }
}
