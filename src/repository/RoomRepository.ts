import { getConnection } from "typeorm";
import { Room } from "../entity/Room";

export class RoomRepository {
    public static getRoomById(roomId: number) {
        return getConnection().manager.findOne(Room, { id: roomId });
    }

    public static getRandomRoom() {
        return getConnection()
            .createQueryBuilder()
            .select('r.id')
            .from(Room, 'r')
            .getOne();
    }
}