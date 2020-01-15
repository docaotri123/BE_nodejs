import { Type } from "../entity/Type";
import { getConnection } from "typeorm";

export class TypeRepository {

    private static instance: TypeRepository;

    private constructor() { }

    public static getInstance(): TypeRepository {
        if (!TypeRepository.instance) {
            TypeRepository.instance = new TypeRepository();
        }

        return TypeRepository.instance;
    }

    public getTypeByType(type: string): Promise<Type> {
        return getConnection().manager.findOne(Type, {type: type});
    }

}