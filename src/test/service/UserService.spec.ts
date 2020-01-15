import { expect, should } from 'chai';
import 'mocha';
import { Md5 } from "ts-md5";
import { HASH_STR, ROLE } from '../../constant'
import { UserService } from '../../service/UserService';
import { UserRepository } from '../../repository/UserRepository';
import { UserModel } from '../../model/UserModel';
import Common from '../../util/Common';
import { before } from 'mocha';


describe('UserService', () => {
    const userRepo = UserRepository.getInstance();
    const userService = UserService.getInstance();


    describe('getUserByEmailAndPassword', () => {
        let email, password , email_not_exist;

        before(()=>{
            email = 'trido@gmail.com';
            password = Md5.hashStr('e10adc3949ba59abbe56e057f20f883e' + HASH_STR);
            email_not_exist = 'trinot@gmail.com'
        })

        it('check username is incorrect', async () => {
            const user = await userRepo.getUserByEmailAndPassword(email_not_exist, password);
            should().not.exist(user);
        })

        it('check username is correct and password is incorrect', async () => {
            const checkPass = await userRepo.getUserByEmailAndPassword(email, '....');
            should().not.exist(checkPass);
        })

        it('check username and password is correct', async () => {
            const user = await userRepo.getUserByEmailAndPassword(email, password)
            expect(user.email).to.equal(email);
        })
    })

    describe('getUserByEmail', () => {
        it('check get user is not null',async () => {
            const user = await userRepo.getUserByEmail('trido@gmail.com');
            should().exist(user);
        })

        it('check get user is null',async () => {
            const user = await userRepo.getUserByEmail('trinot@gmail.com');
            should().not.exist(user);
        })
    })

    describe('getUserById', () => {
        const userId = '1ec4eee9-e858-41fd-852c-8202ec783e59'

        it('check get user is not null',async () => {
            const user = await userRepo.getUserById(userId);
            expect(user).to.have.property('id');
            expect(user.id).to.equal(userId);
        })

        it('check get user is null',async () => {
            const user = await userRepo.getUserById('-1');
            should().not.exist(user);
        })
    })

    describe('getRandomUser', () => {

        it('check get user', async () => {
            const user = await userRepo.getRandomUser();
            expect(user).to.have.property('id');
        })
    })

    xdescribe('insertUser', () => {

        const user = new UserModel();
        user.email = `${Common.getRandomInt(100)}dctri${Common.getRandomInt(500)}@email.com`;
        user.password = 'e10adc3949ba59abbe56e057f20f883e';
        user.phone = '0965528621';

        it('check insert user success',async () => {
            const result = await userRepo.insertUser(user);
            expect(result).to.have.property('id');
        })

        it('check insert user fail', async () => {
            try {
                user.email = null;
                await userRepo.insertUser(user);
            } catch(err) {
                should().exist(err);
            }
        })
    })

    xdescribe('registerUser', async () => {

        const user = new UserModel();
        user.email = 'trido@gmail.com';
        user.password ='e10adc3949ba59abbe56e057f20f883e';
        user.phone = '01688946252';

        it('register has email exists', async () => {
            const handle = await userService.registerUser(user);
            const { code } = handle;
            expect(code).to.equal(400);
        })

        it('register is successfully', async () => {
            user.email = `${Common.getRandomInt(500)}tri${Common.getRandomInt(200)}cao${Common.getRandomInt(500)}@gmail.com`;
            const handle = await userService.registerUser(user);
            const { code } = handle;
            expect(code).to.equal(201);
        })

        it('register is server error', async () => {
            user.email = null;
            const handle = await userService.registerUser(user);
            const { code } = handle;
            expect(code).to.equal(500);
        })

    })
    
    describe('handleLogin', () => {
        const username = 'trido@gmail.com'
        const password = Md5.hashStr('e10adc3949ba59abbe56e057f20f883e' + HASH_STR);

        it('handleLogin username is incorrect', async () => {
            const handle = await userService.handleLogin(username +'.', password);
            const { code } = handle;
            expect(code).to.equal(400);
        })

        it('handleLogin username is correct and password is incorrect', async () => {
            const handle = await userService.handleLogin(username , password+'.');
            const { code } = handle;
            expect(code).to.equal(401);
        })

        it('handleLogin is succesfully', async () => {
            const handle = await userService.handleLogin(username , password);
            const { code, data } = handle;
            expect(code).to.equal(200);
            should().exist(data);
        })
    })

})