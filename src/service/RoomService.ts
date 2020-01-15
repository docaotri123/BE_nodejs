import { getConnection } from "typeorm";
import { Room } from "../entity/Room";
import { BookRoom } from "../entity/BookRoom";
import { HandleObj } from "../model/HandleModel";
import { RoomModel } from "../model/RoomModel";
import { TypeRepository } from "../repository/TypeRepository";

export class RoomService {

    private static instance: RoomService;

    private constructor() { }

    public static getInstance(): RoomService {
        if (!RoomService.instance) {
            RoomService.instance = new RoomService();
        }

        return RoomService.instance;
    }

    public async handleGetRooms(): Promise<HandleObj> {
        try {
            const instance = RoomService.getInstance();
            const rooms = await instance.getRooms();

            return new HandleObj(true, 200, 'get list rooms successfully', rooms);
        } catch(err) {
            console.log(err);
            return new HandleObj(false, 500, err);
        }
    }

    public async handleInsertRoom(roomModel: RoomModel): Promise<HandleObj> {
        try {
            const instance = RoomService.getInstance();
            const typeInstance = TypeRepository.getInstance();

            const room = new Room();
            const type = await typeInstance.getTypeByType(roomModel.type);
            room.description = roomModel.description;
            room.imageURL = roomModel.image;
            room.quality = roomModel.quality;
            room.price = roomModel.price;
            room.type = type;
            if (!type) {
                return new HandleObj(false, 402, 'Type room is not exits');
            }
            await instance.insertRoom(room);

            return new HandleObj(true, 201, 'Insert room is successfully');
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