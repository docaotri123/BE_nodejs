import { User } from "../../entity/User";
import { UserModel } from "../../model/UserModel";
import { HandleObj } from "../../model/HandleModel";
import { ROLE, HttpStatus, User_Status, Server_Status } from "../../constant";
import * as jwt from 'jsonwebtoken';
import { SECRET } from "../../app.config";
import { UserRepository } from "../../repository/v1.0/UserRepository";
import { EntityMap } from "../../map/EntityMap";
import { RoleRepository } from "../../repository/v1.0/RoleRepository";
import * as bcrypt from 'bcrypt';
import { ErrorMessage } from "../../model/ErrorMessageModel";

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
                const exists = User_Status.EmailExists;
                const error = new ErrorMessage(exists.mess, '', exists.code);
                return new HandleObj( HttpStatus.BadRequest, '', error);
            }
            
            const user = new User();
            const role = await roleRepo.getRoleByRole(ROLE.CUSTOMER);
            EntityMap.mapUser(user, userModel, role);
            
            await userRepo.insertUser(user);

            return new HandleObj(HttpStatus.Created);
        } catch (err) {
            console.log('lal');
            
            console.log(err);
            const server = Server_Status.error;
            const error = new ErrorMessage(server.mess, err.message, server.code);
            return new HandleObj(HttpStatus.InternalServerError, '' ,error);
        }
    }

    public async handleLogin(username: string, password: string): Promise<HandleObj> {
        try {
            const userRepo = UserRepository.getInstance();
            const user = await userRepo.getUserByEmail(username);
            const invalid = User_Status.InvalidCredentials;

            if (!user) {
                const error = new ErrorMessage(invalid.mess, '', invalid.code);
                return new HandleObj(HttpStatus.BadRequest, '', error);
            }
            const checkPassword = bcrypt.compareSync(password, user.password)

            if (!checkPassword) {
                const error = new ErrorMessage(invalid.mess, '', invalid.code);
                return new HandleObj(HttpStatus.BadRequest, '', error);
            }

            const token = jwt.sign({ user: user }, SECRET, {expiresIn: '24h'});

            return new HandleObj(HttpStatus.Ok, null, null ,{token: token});
        } catch(err) {
            console.log(err);
            const server = Server_Status.error;
            const error = new ErrorMessage(server.mess, err.message, server.code);
            return new HandleObj(HttpStatus.InternalServerError, '' ,error);
        }
    }

}