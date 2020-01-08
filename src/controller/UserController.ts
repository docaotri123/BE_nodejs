import { ResponseObj } from '../model/response';
import { Post, Body, JsonController } from 'routing-controllers';
import { UserModel } from '../model/UserModel';
import { Md5 } from 'ts-md5';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import { ROLE, HASH_STR } from '../constant';
import { Role } from '../entity/Role';
import { LoginModel } from '../model/LoginModel';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../app.config';
import { UserService } from '../service/UserService';

@JsonController()
export class UserController {

    @Post('/user')
    async RegisterAccount(@Body() userBody: UserModel) {   

        const handle = await UserService.registerUser(userBody);
        const {code, mess} = handle;

        if (!handle.status) {
            return new ResponseObj(code, mess);
        }

        return new ResponseObj(code, mess);
    }

    @Post('/login')
    async Login(@Body() loginModel: LoginModel) {
        try {

            const username = loginModel.username;
            const password = Md5.hashStr(loginModel.password + HASH_STR);
            const handle = await UserService.handleLogin(username, password);
            const {code, mess, data} = handle;

            if (! handle.status) {
                return new ResponseObj(code, mess);
            }
            
            return new ResponseObj(code, mess, data);
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

}
