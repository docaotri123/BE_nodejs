import { getConnection } from "typeorm";
import { User } from "../entity/User";

export class UserService {
    public static getUserById(userId: string) {
        return getConnection().manager.findOne(User, { id: userId });
    }
}