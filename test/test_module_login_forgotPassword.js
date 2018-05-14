process.env.NODE_ENV = 'test';

const assert = require('assert');
const _Utils = require('./../application/_UTILS');
const chai = require('chai');
const chaiHttp = require('chai-http');
const redis = require('redis');
const client = redis.createClient(6379, 'localhost');
const webkbuser = require('./../mdb_schema/webkbuser');

const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('module/LOGIN/forgotPassword.js', () => {
    before('set mongo user', (done) => {
        let user = new webkbuser({
            "user_permission": [
                "*",
                "ADMIN"
            ],
            "user_username": "testuser",
            "user_psw": "c66b7e1c0d25fcccef09a0702e0ac2351291bb6336d1d7e4e034735488614248",
            "user_forname": "TEST_USER_FORNAME",
            "user_surname": "TEST_USER_SURNAME",
            "user_email": "kbuczynski@outlook.com",
            "user_dob": "2018-01-1",
            "user_secret_q": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
            "user_secret_p": "123"
        });
        user.save();
        done();
    });


    after('Remove reddis entry', (done) => {
        client.del("TEST_KEY_REDIS_123");
        webkbuser.remove({
            "user_username": "testuser"
        }, (err) => {
            if (err) throw err;
        });
        done();
    });
});