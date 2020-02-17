import { Response } from "express";
import { ResSuccess } from '../../model/ResponseModel';
import { Post, Body, Res, JsonController, Get } from 'routing-controllers';
import { UserModel } from '../../model/UserModel';
import { LoginModel } from '../../model/LoginModel';
import { UserService } from '../../service/v1.0/UserService';
import { ResError } from '../../model/ResError';

// @JsonController('/v1.0/user-management')
@JsonController()
export class UserController {

    @Get('/users')
    async ListUser(
        @Res() res: Response) {
        return res.status(200).send(new ResSuccess('abc'));
    }

    @Post('/users')
    async RegisterUser(
        @Body() userBody: UserModel,
        @Res() res: Response) {
        const userService = UserService.getInstance();   
        const handle = await userService.registerUser(userBody);
        const {code, error} = handle;

        if (error) {
            return res.status(code).send(new ResError(error));
        }
        return res.status(code).send(new ResSuccess());
    }

    @Post('/sessions')
    async Login(
        @Body() loginModel: LoginModel,
        @Res() res: Response) {
        const userService = UserService.getInstance();
        const username = loginModel.username;        

        const handle = await userService.handleLogin(username, loginModel.password);
        const { code, error, data } = handle;

        if (error) {
            return res.status(code).send(new ResError(error));
        }
        return res.status(code).send(new ResSuccess(null, data));
    }

}
