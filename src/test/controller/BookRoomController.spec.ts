// const chai = require('chai');
// const chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// const { expect, should } = chai;
// import 'mocha';
// import app from '../../app';
// import { bookRoom, token_not_author, token } from '../../mock/MockConstant'

// describe('BookingController', () => {

//     describe('bookingroom API', () => {

//         it('Token expried', () => {
//             chai
//                 .request(app)
//                 .post('/bookingroom')
//                 .set('token','abc')
//                 .send(bookRoom)
//                 .end((err, res) => {
//                     const data = JSON.parse(res.text);
//                     expect(data.code).to.equal(400);
//                 });
//         })

//         it('Token not author', () => {
//             chai
//                 .request(app)
//                 .post('/bookingroom')
//                 .set('token', token_not_author)
//                 .send(bookRoom)
//                 .end((err, res) => {
//                     const data = JSON.parse(res.text);
//                     expect(data.code).to.equal(401);
//                 });
//         })

//         it('Add success to queue', () => {
//             chai
//                 .request(app)
//                 .post('/bookingroom')
//                 .set('token', token)
//                 .send(bookRoom)
//                 .end((err, res) => {
//                     const data = JSON.parse(res.text);
//                     expect(data.code).to.equal(200);
//                 });
//         })

//         it('Add fail to queue', () => {
//             const booking = bookRoom;
//             booking.roomID = null;
//             chai
//                 .request(app)
//                 .post('/bookingroom')
//                 .set('token', token)
//                 .send(booking)
//                 .end((err, res) => {
//                     const data = JSON.parse(res.text);
//                     expect(data.code).to.equal(500);
//                 });
//         })

//     })

// }) 