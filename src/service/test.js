const chai = require('chai');
const simon = require('sinon');
const expect = chai.expect;
chai.should();

describe('test', () => {
    it('should be true', () => {
        expect(true).to.be.true;
    })

    it('should be false', () => {
        expect(false).to.be.false;
    })
})

describe.only('simon tets', () => {
    let student, schedule;
    beforeEach(() => {
        student = {
            doWork: (classId, cb) => {
                console.log('doWork student');
                if (!!cb.doWork) {
                    cb.doWork();
                } else {
                    cb();
                }
            },
            addStudent: (schedule) => {
                if(!schedule.studentIsFull()) {
                    return true;
                }
                return false;
            }
        },
        schedule = {
            doWork: () => {
                console.log('class dropped');
            },
            studentIsFull: () => {
                return true;
            }
        }
    })


    describe('test callback', ()=>{
        afterEach(() => {
            simon.restore();
        })
        it('cb should be call', () =>{
            const sky = simon.spy();
            student.doWork(1, sky);
            sky.called.should.be.true;
        })

        it('cb should be call and log', () =>{
            const func = () => {
                console.log('func'); 
            }
            const sky = simon.spy(func);
            student.doWork(1, sky);
            sky.called.should.be.true;
        })

        it('abc ', () =>{
            simon.spy(schedule, 'doWork');
            student.doWork(1, schedule);
            schedule.doWork.called.should.be.true;
        })
    })

    describe('student with stub', () => {
        afterEach(() => {
            simon.restore();
        })

        it('should call a stubbed method', () => {
            const stub = simon.stub(schedule);
            student.doWork(1, stub);
            stub.doWork.called.should.be.true;
        })
        it('should return true when class is not full', () => {
            const stub = simon.stub(schedule);
            // stub.studentIsFull.returns(false);
            const returnVal = student.addStudent(stub);
            returnVal.should.be.true;
        })
    })

    describe('student with mock', () => {

        afterEach(() => {
            simon.restore();
        })

        it('mock schedule', () => {
            const mockObj = simon.mock(schedule);
            const expectation = mockObj.expects('studentIsFull').once();

            student.addStudent(schedule);
            expectation.verify();
        })
    })
});