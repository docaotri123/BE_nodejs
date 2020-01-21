import { Response } from "express";
import { ResSuccess } from '../../model/ResponseModel';
import { Post, Body, Res, JsonController } from 'routing-controllers';
import { UserModel } from '../../model/UserModel';
import { LoginModel } from '../../model/LoginModel';
import { UserService } from '../../service/v1.0/UserService';
import { ResError } from '../../model/ResError';

@JsonController('/v1.0/user-management')
export class UserController {

    @Post('/users')
    async RegisterAccount(
        @Body() userBody: UserModel,
        @Res() res: Response) {
        const userService = UserService.getInstance();   
        const handle = await userService.registerUser(userBody);
        const {code, mess, error} = handle;
        res.status(code);

        if (error) {
            return new ResError(error);
        }
        return new ResSuccess(mess);
    }

    @Post('/sessions')
    async Login(
        @Body() loginModel: LoginModel,
        @Res() res: Response) {
        const userService = UserService.getInstance();
        const username = loginModel.username;        

        const handle = await userService.handleLogin(username, loginModel.password);
        const { code, mess, error, data } = handle;
        res.status(code);

        if (error) {
            return new ResError(error);
        }

        return new ResSuccess(mess, data);
    }

}
