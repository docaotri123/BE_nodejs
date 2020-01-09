import { ResponseObj } from '../model/ResponseModel';
import { Post, Body, JsonController } from 'routing-controllers';
import { UserModel } from '../model/UserModel';
import { Md5 } from 'ts-md5';
import { LoginModel } from '../model/LoginModel';
import { UserService } from '../service/UserService';
import { HASH_STR } from '../constant';

@JsonController()
export class UserController {

    @Post('/user')
    async RegisterAccount(@Body() userBody: UserModel) {
        const userService = UserService.getInstance();   
        const handle = await userService.registerUser(userBody);
        const {code, mess} = handle;

        if (!handle.status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess);
    }

    @Post('/login')
    async Login(@Body() loginModel: LoginModel) {
        const userService = UserService.getInstance(); 
        const username = loginModel.username;
        const password = Md5.hashStr(loginModel.password + HASH_STR);

        const handle = await userService.handleLogin(username, password);
        const { code, mess, data } = handle;

        if (!handle.status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess, data);
    }

}
