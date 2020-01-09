import { Type } from "../entity/Type";
import { getConnection } from "typeorm";

export class TypeService {

    private static instance: TypeService;

    private constructor() { }

    public static getInstance(): TypeService {
        if (!TypeService.instance) {
            TypeService.instance = new TypeService();
        }

        return TypeService.instance;
    }

    public getTypeByType(type: string): Promise<Type> {
        return getConnection().manager.findOne(Type, {type: type});
    }

}