import { expect, should } from 'chai';
import 'mocha';
import { createConnection, getConnection, getConnectionManager } from 'typeorm';
import { sqlConfig_test, sqlConfig } from '../../app.config';
import { Md5 } from "ts-md5";
import { HASH_STR, ROLE } from '../../constant'
import { UserService } from '../../service/UserService';
import { UserModel } from '../../model/UserModel';


describe('UserService', () => {

    describe('getUserByEmail', () => {
        const email = 'trido@gmail.com'
        const email_not_exist = 'trinot@gmail.com'

        it('check get user is not null', () => {

        })

        it('check get user is null', () => {
            
        })
    })

    describe('getUserByEmailAndPassword', () => {
        const email = 'trido@gmail.com'
        const password = Md5.hashStr('e10adc3949ba59abbe56e057f20f883e' + HASH_STR);
        const email_not_exist = 'trinot@gmail.com'

        it('check username is incorrect', () => {

        })

        it('check username is correct and password is incorrect', () => {
            
        })

        it('check username and password is correct', () => {

        })
    })

    describe('getUserById', () => {
        const userId = 'abc'

        it('check get user is not null', () => {

        })

        it('check get user is null', () => {
            
        })
    })

    describe('getRandomUser', () => {

        it('check get user', () => {

        })
    })

    describe('insertUser', () => {

        // const user = new UserModel();
        // user.email = 'dctri@email.com';
        // user.password = 'e10adc3949ba59abbe56e057f20f883e';
        // user.phone = '0965528621';

        // it('check insert user success',async () => {
        //     const result = await userInstance.insertUser(user);
        //     expect(result).to.have.property('id');
        // })

        // it('check insert user fail', async () => {
        //     try {
        //         user.email = null;
        //         await userInstance.insertUser(user);
        //     } catch(err) {
        //         should().exist(err);
        //     }
        // })
    })

    describe('registerUser', () => {

        it('register is successfully', () => {

        })

        it('register has email exists', () => {

        })
    })
    
    describe('handleLogin', () => {
        const email = 'trido@gmail.com'
        const password = Md5.hashStr('e10adc3949ba59abbe56e057f20f883e' + HASH_STR);
        const email_not_exist = 'trinot@gmail.com'

        it('handleLogin username is incorrect', () => {

        })

        it('handleLogin username is correct and password is incorrect', () => {
            
        })

        it('handleLogin is succesfully', () => {

        })
    })

})