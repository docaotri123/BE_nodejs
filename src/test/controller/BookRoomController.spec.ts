const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect, should } = chai;
import 'mocha';
import app from '../../app';

describe('BookingController', () => {

    after(() => {
    })

    describe('bookingroom API', () => {
        it('Test', () => {
            chai
                .request(app)
                .get('/test')
                .end((err, res) => {
                    const data = JSON.parse(res.text);
                    expect(data.code).to.equal(200);
                });
        })
    
    })

})