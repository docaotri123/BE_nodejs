import { getConnection } from "typeorm";
import { User } from "../../entity/User";

export class UserRepository {

    private static instance: UserRepository;

    private constructor() { }

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }

        return UserRepository.instance;
    }

    public getUserByEmail(email: string): Promise<User> {
        return getConnection()
            .manager
            .findOne(User, { email: email });
    }

    public getUserById(userId: string): Promise<User> {
        return getConnection()
            .manager
            .findOne(User, { id: userId });
    }

    public getRandomUser(): Promise<User> {
        return getConnection().createQueryBuilder()
            .select('u.id')
            .from(User, 'u')
            .getOne();
    }

    public async insertUser(user: User): Promise<any> {
        return getConnection()
            .manager
            .save(user);
    }

}