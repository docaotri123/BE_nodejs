import { User } from "../../entity/User";
import { UserModel } from "../../model/UserModel";
import { HandleObj } from "../../model/HandleModel";
import { ROLE } from "../../constant";
import * as jwt from 'jsonwebtoken';
import { SECRET } from "../../app.config";
import { UserRepository } from "../../repository/user/UserV1.0Repository";
import { EntityMap } from "../../map/EntityMap";
import { RoleRepository } from "../../repository/role/RoleV1.0Repository";
import * as bcrypt from 'bcrypt';

export class UserService {

    private static instance: UserService;

    private constructor() { }

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    public async registerUser(userModel: UserModel): Promise<HandleObj> {
        try {
            // check unique user
            const userRepo = UserRepository.getInstance();
            const roleRepo = RoleRepository.getInstance();

            const email = await userRepo.getUserByEmail(userModel.email);
            if (email) {
                return new HandleObj(false, 402, 'Email has exists');
            }
            
            const user = new User();
            const role = await roleRepo.getRoleByRole(ROLE.CUSTOMER);
            EntityMap.mapUser(user, userModel, role);
            
            await userRepo.insertUser(user);

            return new HandleObj(true, 201, 'Register is successfully');
        } catch (err) {
            console.log(err);
            return new HandleObj(false, 500, err);
        }
    }

    public async handleLogin(username: string, password: string | Int32Array): Promise<HandleObj> {
        try {
            const userRepo = UserRepository.getInstance();
            const user = await userRepo.getUserByEmail(username);

            if (!user) {
                return new HandleObj(false, 400, 'username incorrect');
            }

            const checkPassword = bcrypt.compareSync(password, user.password)

            if (!checkPassword) {
                return new HandleObj(false, 401, 'password incorrect');
            }

            const token = jwt.sign({ user: user }, SECRET, {expiresIn: '24h'});

            return new HandleObj(true, 200, 'Login Succsessfully',{token: token});
        } catch(err) {
            console.log(err);
            return new HandleObj(false, 500, err);
        }
    }

}