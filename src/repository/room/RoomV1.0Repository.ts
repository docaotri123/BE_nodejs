import { getConnection } from "typeorm";
import { Room } from "../../entity/Room";
import { BookRoom } from "../../entity/BookRoom";

export class RoomRepository {

    private static instance: RoomRepository;

    private constructor() { }

    public static getInstance(): RoomRepository {
        if (!RoomRepository.instance) {
            RoomRepository.instance = new RoomRepository();
        }

        return RoomRepository.instance;
    }


    public getRoomById(roomId: number): Promise<Room> {
        return getConnection()
        .manager
        .findOne(Room, { id: roomId });
    }
    
    public getRooms(): Promise<Room[]> {
        return getConnection().manager
            .createQueryBuilder()
            .select('r')
            .from(Room, 'r')
            .leftJoinAndMapOne('r.type', 'type', 't', 't.id = r.type')
            .where('isDeleted = :isDeleted', { isDeleted: false })
            .getMany();
    }

    public insertRoom(room: Room): Promise<any> {
        return getConnection()
            .manager
            .save(room);
    }

    public deleteRoom(roomId: number): Promise<any> {
        return getConnection()
            .createQueryBuilder()
            .update(Room)
            .set({ isDeleted: true })
            .where('id = :id', { id: roomId })
            .execute();
    }

    public getRoomsNotBooking(rooms: Room[], booksByTime: BookRoom[]) {
        return rooms.filter(room => {
            return !booksByTime.find(book => book.room.id === room.id);
        });
    }

}