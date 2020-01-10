const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect, should } = chai;
import 'mocha';
import Common from '../../util/Common';
import app from '../../app';
import { token_not_author, token } from '../../mock/MockConstant'

describe.only('RoomController', () => {
    describe('get rooms', () => {

        it('Token expried', () => {
            chai
                .request(app)
                .get('/rooms')
                .set('token', 'abc')
                .end((err, res) => {
                    const data = JSON.parse(res.text);
                    expect(data.code).to.equal(400);
                });
        })

        it('Token not author', () => {
            chai
                .request(app)
                .get('/rooms')
                .set('token', token_not_author)
                .end((err, res) => {
                    const data = JSON.parse(res.text);
                    console.log(data);
                    
                    expect(data.code).to.equal(401);
                });
        })

        it('get rooms is successfully', () => {
            chai
                .request(app)
                .get('/rooms')
                .set('token', token)
                .end((err, res) => {
                    const data = JSON.parse(res.text);
                    expect(data.code).to.equal(200);
                });
        })
    })
})