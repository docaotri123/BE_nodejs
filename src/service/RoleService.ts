import { Role } from "../entity/Role";
import { getConnection } from "typeorm";

export class RoleService {
    private static instance: RoleService;

    private constructor() { }

    public static getInstance(): RoleService {
        if (!RoleService.instance) {
            RoleService.instance = new RoleService();
        }

        return RoleService.instance;
    }

    public getRoleByRole(role: string): Promise<Role> {
        return getConnection().manager.findOne(Role, {role: role});
    }

    public getRoleByUserId(userId: string): Promise<Role> {
        return getConnection()
            .createQueryBuilder()
            .select('r')
            .from(Role, 'r')
            .where('u.id = :userId', { userId: userId })
            .leftJoin('user', 'u', 'u.role.id = r.id')
            .getOne();
    }

}