import { Role } from "../../entity/Role";
import { getConnection } from "typeorm";

export class RoleRepository {
    private static instance: RoleRepository;

    private constructor() { }

    public static getInstance(): RoleRepository {
        if (!RoleRepository.instance) {
            RoleRepository.instance = new RoleRepository();
        }

        return RoleRepository.instance;
    }

    public getRoleByRole(role: string): Promise<Role> {
        return getConnection()
            .manager
            .findOne(Role, { role: role });
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