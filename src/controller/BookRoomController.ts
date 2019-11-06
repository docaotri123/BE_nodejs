import { JsonController, Body, Post, Param } from 'routing-controllers';
import { BookRoomModel } from '../model/BookRoomModel';
import { ResponseObj } from '../model/response';
import { checkPermission } from '../middleware/Authorizer';
import { ROLE } from '../constant';
import { Room } from '../entity/Room';

@JsonController()
export class BookRoomController {
    @Post('/bookroom/:id')
    async RegisterAccount(
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
            

        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }
}
