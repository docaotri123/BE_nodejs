const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect, should } = chai;
import 'mocha';
import Common from '../../util/Common';
import app from '../../app';

describe('UserController', () => {

    xdescribe('register API', () => {
        let user ;
        beforeEach(() => {
            user = {
                email: `tri${Common.getRandomInt(200)}do${Common.getRandomInt(500)}@${Common.getRandomInt(500)}gmail.com`,
                phone: "01688946252",
                password: "e10adc3949ba59abbe56e057f20f883e"
            }
        })
        it('register has email exists', () => {
            user.email = 'trido@gmail.com';
            chai
                .request(app)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    const data = JSON.parse(res.text);
                    expect(data.code).to.equal(400);
                });
        })

        it('register is successfully', () => {
            chai
                .request(app)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    const data = JSON.parse(res.text);
                    expect(data.code).to.equal(201);
                });
        })

        it('register is server error', () => {
            user.email = null;
            chai
                .request(app)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    const data = JSON.parse(res.text);
                    expect(data.code).to.equal(500);
                });
        })
    })


    describe('login API', () => {
        let user: any = {};
        beforeEach(()=>{
            user.username = '324tri19cao237@gmail.com';
            user.password = 'e10adc3949ba59abbe56e057f20f883e';
        })
        it('login with username is incorrect', () => {
            user.username = 'abc@gmail.com';
            chai
            .request(app)
            .post('/login')
            .send(user)
            .end((err, res) => {
                const data = JSON.parse(res.text);
                expect(data.code).to.equal(400);
            });
        })

        it('login with username is correct and password is incorrect', () => {
            user.password = '....';
            chai
            .request(app)
            .post('/login')
            .send(user)
            .end((err, res) => {
                const data = JSON.parse(res.text);
                expect(data.code).to.equal(401);
            });
        })

        it('login is successfully', () => {
            chai
            .request(app)
            .post('/login')
            .send(user)
            .end((err, res) => {
                const data = JSON.parse(res.text);
                expect(data.code).to.equal(200);
                should().exist(data.data);
            });
        })

    })

})