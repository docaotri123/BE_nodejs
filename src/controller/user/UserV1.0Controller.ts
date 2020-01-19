import { ResponseObj } from '../../model/ResponseModel';
import { Post, Body, JsonController } from 'routing-controllers';
import { UserModel } from '../../model/UserModel';
import { LoginModel } from '../../model/LoginModel';
import { UserService } from '../../service/user/UserV1.0Service';

@JsonController('/v1.0/sessions')
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

    @Post('')
    async Login(@Body() loginModel: LoginModel) {
        const userService = UserService.getInstance(); 
        const username = loginModel.username;
        // const password = Md5.hashStr(loginModel.password + HASH_STR);
        

        const handle = await userService.handleLogin(username, loginModel.password);
        const { code, mess, data } = handle;

        if (!handle.status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess, data);
    }

}
