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
}