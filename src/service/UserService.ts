import { getConnection } from "typeorm";
import { User } from "../entity/User";
import { UserModel } from "../model/UserModel";
import { HandleObj } from "../model/HandleModel";
import { Md5 } from "ts-md5";
import { HASH_STR, ROLE } from "../constant";
import { Role } from "../entity/Role";
import * as jwt from 'jsonwebtoken';
import { SECRET } from "../app.config";

export class UserService {

    public static async registerUser(user: UserModel): Promise<HandleObj> {
        try {
            // check unique user
            const email = await UserService.getUserByEmail(user.email);
            if (email) {
                return new HandleObj(false, 400, 'Email has exists');
            }

            await UserService.insertUser(user);

            return new HandleObj(true, 201, 'Register is successfully');
        } catch (err) {
            console.log(err);
            return new HandleObj(false, 500, err);
        }
    }

    public static async handleLogin(username: string, password: string | Int32Array): Promise<HandleObj> {
        try {
            const user = UserService.getUserByEmailAndPassword(username, password);

            if (!user) {
                return new HandleObj(false, 400, 'username or password incorrect');
            }

            const token = jwt.sign({ user: user }, SECRET, {expiresIn: '24h'});

            return new HandleObj(true, 200, 'Login Succsessfully',{token: token});
        } catch(err) {
            console.log(err);
            return new HandleObj(false, 500, err);
        }
    }

    public static getUserByEmail(email: string): Promise<User> {
        return getConnection().manager.findOne(User, { email: email });
    }

    public static getUserById(userId: string): Promise<User> {
        return getConnection().manager.findOne(User, { id: userId });
    }

    public static getUserByEmailAndPassword(username: string, password: string | Int32Array): Promise<User> {
        return getConnection()
            .createQueryBuilder()
            .select('u.id')
            .addSelect('u.email')
            .from(User, 'u')
            .leftJoinAndMapOne('u.role', 'role', 'r', 'u.role = r.id')
            .where('u.email = :email AND u.password = :password',
                { email: username, password: password })
            .getOne();
    }

    public static getRandomUser(): Promise<User> {
        return getConnection().createQueryBuilder()
            .select('u.id')
            .from(User, 'u')
            .getOne();
    }

    public static async insertUser(user: UserModel): Promise<any> {
        // save user with role (customer)
        const userEntity = new User();
        userEntity.email = user.email;
        userEntity.phone = user.phone;
        userEntity.password = Md5.hashStr(user.password + HASH_STR);
        userEntity.role = await getConnection().manager.findOne(Role, { role: ROLE.CUSTOMER });

        return getConnection().manager.save(userEntity);
    }

}