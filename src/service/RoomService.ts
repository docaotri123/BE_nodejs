import { getConnection } from "typeorm";
import { Room } from "../entity/Room";
import { BookRoom } from "../entity/BookRoom";
import { HandleObj } from "../model/HandleModel";
import { RoomModel } from "../model/RoomModel";
import { TypeService } from "./TypeService";

export class RoomService {

    private static instance: RoomService;

    private constructor() { }

    public static getInstance(): RoomService {
        if (!RoomService.instance) {
            RoomService.instance = new RoomService();
        }

        return RoomService.instance;
    }

    public getRoomById(roomId: number) {
        return getConnection().manager.findOne(Room, { id: roomId });
    }
    
    public getRooms() {
        return getConnection().manager
            .createQueryBuilder()
            .select('r')
            .from(Room, 'r')
            .leftJoinAndMapOne('r.type', 'type', 't', 't.id = r.type')
            .where('isDeleted = :isDeleted', { isDeleted: false })
            .getMany();
    }

    public getRoomsNotBooking(rooms: Room[], booksByTime: BookRoom[]) {
        return rooms.filter(room => {
            return !booksByTime.find(book => book.room.id === room.id);
        });
    }

    public insertRoom(room: Room): Promise<any> {
        return getConnection().manager.save(room);
    }

    public deleteRoom(roomId: number): Promise<any> {
        return getConnection()
            .createQueryBuilder()
            .update(Room)
            .set({ isDeleted: true })
            .where('id = :id', { id: roomId })
            .execute();
    }

    public async handleGetRooms(): Promise<HandleObj> {
        try {
            const instance = RoomService.getInstance();
            const rooms = await instance.getRooms();
            return new HandleObj(false, 200, 'get list rooms successfully', rooms);
        } catch(err) {
            console.log(err);
            return new HandleObj(false, 500, err);
        }
    }

    public async handleInsertRoom(roomModel: RoomModel): Promise<HandleObj> {
        try {
            const instance = RoomService.getInstance();
            const typeInstance = TypeService.getInstance();

            const rooms = await instance.getRooms();
            const room = new Room();
            const type = await typeInstance.getTypeByType(roomModel.type);
            room.description = roomModel.description;
            room.imageURL = roomModel.image;
            room.quality = roomModel.quality;
            room.price = roomModel.price;
            if (!type) {
                return new HandleObj(false, 400, 'Type room is not exits');
            }
            await instance.insertRoom(room);

            return new HandleObj(false, 200, 'Insert room is successfully', rooms);
        } catch(err) {
            console.log(err);
            return new HandleObj(false, 500, err);
        }
    }

    public async handleDeleteRoom(roomId: number): Promise<HandleObj> {
        try {
            const instance = RoomService.getInstance();
            await instance.deleteRoom(roomId);
            
            return new HandleObj(true, 200, 'Delete room is successfully');
        } catch(err) {
            console.log(err);
            return new HandleObj(false, 500, err);
        }
    }

}