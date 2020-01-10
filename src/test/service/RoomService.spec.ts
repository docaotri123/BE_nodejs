import { expect, should } from 'chai';
import 'mocha';
import { RoomService } from '../../service/RoomService'
import Common from '../../util/Common';
import { Room } from '../../entity/Room';
import { TYPE } from '../../constant';
import { TypeService } from '../../service/TypeService';
import { BookRoom } from '../../entity/BookRoom';
import { RoomModel } from '../../model/RoomModel';

describe.only('RoomService', () => {
    const roomInstance = RoomService.getInstance();

    describe('getRoomById', () => {
        it('room is exists', async () => {
            const roomId = 1;
            const room = await roomInstance.getRoomById(roomId);
            expect(room.id).to.equal(roomId);
        })

        it('room is not exists', async () => {
            const roomId = -1;
            const room = await roomInstance.getRoomById(roomId);
            should().not.exist(room);
        })
    })

    describe('getRooms', () => {
        it('rooms is exists', async () => {
            const rooms = await roomInstance.getRooms();
            expect(rooms.length).to.greaterThan(1);
        })
    })

    xdescribe('getRoomsNotBooking', () => {
        it('check getRoomsNotBooking', async () => {
            const rooms = await roomInstance.getRooms();
            const roomBooking = new BookRoom();
            roomBooking.room = await roomInstance.getRooms()[0];
            const results = roomInstance.getRoomsNotBooking(rooms, [roomBooking]);

            expect(results.length).to.equal(rooms.length - 1);
        })
    })

    xdescribe('insertRoom', () => {
        const room = new Room();
        const typeInstance = TypeService.getInstance();
        beforeEach(async () => {
            room.description = 'this is test',
            room.imageURL = 'imgURL';
            room.price = Common.getRandomInt(5000);
            room.quality = Common.getRandomInt(5);
            room.type = await typeInstance.getTypeByType(TYPE.NORMAL);
        })
        it('insert room is seccessfully',async () => {
            const result = await roomInstance.insertRoom(room);
            should().exist(result.id);
        })

        it('insert room is error', async () => {
            try {
                room.price = null;
                await roomInstance.insertRoom(room);
            } catch (err) {
                should().exist(err);
            }
        })
    })

    xdescribe('deleteRoom', () => {
        it('delete room is seccessfully',async () => {
            const roomId = 3;
            const { raw } = await roomInstance.deleteRoom(roomId);
            expect(raw.changedRows).to.equal(1);
        })
    })

    describe('handleGetRooms', () => {
        it('get rooms is successfully', async () => {
            const {code} = await roomInstance.handleGetRooms();
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
            const {code} = await roomInstance.handleInsertRoom(roomModel);
            expect(code).to.equal(200);
        })

        it('insert room is error server', async () => {
            roomModel.image = null;
            const {code} = await roomInstance.handleInsertRoom(roomModel);
            expect(code).to.equal(500);
        })

    })

    describe('handleDeleteRoom',async () => {
        const { code } = await roomInstance.handleDeleteRoom(3);
        expect(code).to.equal(200);
    })
})