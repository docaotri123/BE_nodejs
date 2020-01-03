import { getConnection } from "typeorm";
import { Room } from "../entity/Room";
import { BookRoom } from "../entity/BookRoom";

export class RoomService {
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

    public static getRooms() {
        return getConnection().createQueryBuilder()
            .select('r')
            .from(Room, 'r')
            .getMany();
    }

    public static getRoomsNotBooking(rooms: Room[], booksByTime: BookRoom[]) {
        return rooms.filter(room => {
            return !booksByTime.find(book => book.room.id === room.id);
        });
    }
}