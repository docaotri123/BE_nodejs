import { expect, should } from 'chai';
import 'mocha';
import { RoomRepository } from '../../repository/RoomRepository'
import { RoomService } from '../../service/RoomService'
import Common from '../../util/Common';
import { Room } from '../../entity/Room';
import { TYPE } from '../../constant';
import { TypeRepository } from '../../repository/TypeRepository';
import { BookRoom } from '../../entity/BookRoom';
import { RoomModel } from '../../model/RoomModel';

describe.only('RoomService', () => {
    const roomRepo = RoomRepository.getInstance();
    const roomService = RoomService.getInstance();

    describe('getRoomById', () => {
        it('room is exists', async () => {
            const roomId = 1;
            const room = await roomRepo.getRoomById(roomId);
            expect(room.id).to.equal(roomId);
        })

        it('room is not exists', async () => {
            const roomId = -1;
            const room = await roomRepo.getRoomById(roomId);
            should().not.exist(room);
        })
    })

    describe('getRooms', () => {
        it('rooms is exists', async () => {
            const rooms = await roomRepo.getRooms();
            expect(rooms.length).to.greaterThan(1);
        })
    })

    xdescribe('getRoomsNotBooking', () => {
        it('check getRoomsNotBooking', async () => {
            const rooms = await roomRepo.getRooms();
            const roomBooking = new BookRoom();
            roomBooking.room = await roomRepo.getRooms()[0];
            const results = roomRepo.getRoomsNotBooking(rooms, [roomBooking]);

            expect(results.length).to.equal(rooms.length - 1);
        })
    })

    xdescribe('insertRoom', () => {
        const room = new Room();
        const typeInstance = TypeRepository.getInstance();
        beforeEach(async () => {
            room.description = 'this is test',
            room.imageURL = 'imgURL';
            room.price = Common.getRandomInt(5000);
            room.quality = Common.getRandomInt(5);
            room.type = await typeInstance.getTypeByType(TYPE.NORMAL);
        })
        it('insert room is seccessfully',async () => {
            const result = await roomRepo.insertRoom(room);
            should().exist(result.id);
        })

        it('insert room is error', async () => {
            try {
                room.price = null;
                await roomRepo.insertRoom(room);
            } catch (err) {
                should().exist(err);
            }
        })
    })

    xdescribe('deleteRoom', () => {
        it('delete room is seccessfully',async () => {
            const roomId = 3;
            const { raw } = await roomRepo.deleteRoom(roomId);
            expect(raw.changedRows).to.equal(1);
        })
    })

    describe('handleGetRooms', () => {
        it('get rooms is successfully', async () => {
            const {code} = await roomService.handleGetRooms();
            expect(code).to.equal(200);
        })
    })

    xdescribe('handleInsertRoom', () => {
        const roomModel = new RoomModel();
        roomModel.image = 'testIMG';
        roomModel.description = 'handle insert room';
        roomModel.price = 300;
        roomModel.quality= 3;
        roomModel.type = TYPE.VIP;

        it('insert room is successfully', async () => {
            const {code} = await roomRepo.handleInsertRoom(roomModel);
            expect(code).to.equal(200);
        })

        it('insert room is error server', async () => {
            roomModel.image = null;
            const {code} = await roomRepo.handleInsertRoom(roomModel);
            expect(code).to.equal(500);
        })

    })

    describe('handleDeleteRoom',async () => {
        const { code } = await roomService.handleDeleteRoom(3);
        expect(code).to.equal(200);
    })
})