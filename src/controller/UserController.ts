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

@JsonController()
export class UserController {

    @Post('/user')
    async RegisterAccount(@Body() userBody: UserModel) {
        try {
            // check unique user
            const email = await getConnection().manager.findOne(User, { email: userBody.Email });
            if (email) {
                return new ResponseObj(400, 'Email has exists');
            }
            // save user with role (customer)
            const user = new User();
            user.email = userBody.Email;
            user.phone = userBody.Phone;
            user.password = Md5.hashStr(userBody.Password + HASH_STR);
            user.role = await getConnection().manager.findOne(Role, {role: ROLE.CUSTOMER});

            await getConnection().manager.save(user);

            return new ResponseObj(201, 'Created User');
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Post('/login')
    async Login(@Body() loginModel: LoginModel) {
        try {
            const password = Md5.hashStr(loginModel.Password + HASH_STR);
            const user = await getConnection()
            .createQueryBuilder()
            .select('u.id')
            .addSelect('u.email')
            .from(User, 'u')
            .leftJoinAndMapOne('u.role', 'role', 'r', 'u.role = r.id')
            .where('u.email = :email AND u.password = :password',
                {email: loginModel.Username, password: password})
            .getOne();
            
            if (!user) {
                return new ResponseObj(400, 'username or password incorrect' );
            }
            const token = jwt.sign({ user: user }, SECRET, {expiresIn: '10h'});
            
            return new ResponseObj(200, 'Login Succsessfully', {token: token});
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

}
