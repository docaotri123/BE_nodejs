import { getConnection } from "typeorm";
import { User } from "../entity/User";

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

    public getUserByEmailAndPassword(username: string, password: string | Int32Array): Promise<User> {
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