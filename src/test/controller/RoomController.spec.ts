const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect, should } = chai;
import 'mocha';
import Common from '../../util/Common';
import app from '../../app';
import { token_not_author, token } from '../../mock/MockConstant'
import { RoomModel } from '../../model/RoomModel';

describe.only('RoomController', () => {

    describe('get rooms', () => {

        it('Token expried', async () => {
            const res = await chai
                .request(app)
                .get('/rooms')
                .set('token', 'abc')

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(400);
        })

        it('Token not author', async () => {
            const res = await chai
                .request(app)
                .get('/rooms')
                .set('token', token_not_author)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(401);
        })

        it('get rooms is successfully', async () => {
            const res = await chai
                .request(app)
                .get('/rooms')
                .set('token', token)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(200);
        })
    })

    describe('insert room', () => {
        let room = new RoomModel();
        beforeEach(() => {
            room.description = "this is room" + Common.getRandomInt(500),
            room.image = "https://www.w3schools.com/html/img_chania.jpg",
            room.quality = 3,
            room.price = 2000,
            room.type = "normal"
        })

        it('insert is successfully', async () => {
            const res = await chai
                .request(app)
                .post('/room')
                .set('token', token)
                .send(room)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(201);
        })

        it(`insert don't have type room`, async () => {
            room.type = null;
            const res = await chai
                .request(app)
                .post('/room')
                .set('token', token)
                .send(room)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(402);
        })

        xit('insert is server error', async () => {
            room.price = null;
            const res = await chai
                .request(app)
                .post('/room')
                .set('token', token)
                .send(room)
            const data = JSON.parse(res.text);
            expect(data.code).to.equal(500);
        })

    })

    describe('delete room', () => {
        it('room is deleted', async () => {
            const roomId = 29;
            const res = await chai
                .request(app)
                .delete(`/room/${roomId}`)
                .set('token', token)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(200);
        })
    })

})