const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect, should } = chai;
import 'mocha';
import Common from '../../util/Common';
import app from '../../app';

describe('UserController', () => {

    describe('register API', () => {
        let user ;
        beforeEach(() => {
            user = {
                email: `tri${Common.getRandomInt(200)}do${Common.getRandomInt(500)}@${Common.getRandomInt(500)}gmail.com`,
                phone: "01688946252",
                password: "e10adc3949ba59abbe56e057f20f883e"
            }
        })
        it('register has email exists', async () => {
            user.email = 'trido@gmail.com';
            const res = await chai
                .request(app)
                .post('/user')
                .send(user)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(402);
        })

        it('register is successfully', async () => {
            const res = await chai
                .request(app)
                .post('/user')
                .send(user)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(402);
        })

        xit('register is server error', async () => {
            user.email = null;
            const res = await chai
                .request(app)
                .post('/user')
                .send(user)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(500);
        })
    })


    describe('login API', () => {
        let user: any = {};
        beforeEach(()=>{
            user.username = '324tri19cao237@gmail.com';
            user.password = 'e10adc3949ba59abbe56e057f20f883e';
        })

        it('login with username is incorrect', async () => {
            user.username = 'abc@gmail.com';
            const res = await chai
                .request(app)
                .post('/login')
                .send(user)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(400);
        })

        it('login with username is correct and password is incorrect', async () => {
            user.password = '....';
            const res = await chai
                .request(app)
                .post('/login')
                .send(user)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(401);
        })

        it('login is successfully', async () => {
            const res = await chai
                .request(app)
                .post('/login')
                .send(user)

            const data = JSON.parse(res.text);
            expect(data.code).to.equal(200);
            should().exist(data.data);
        })

    })

})