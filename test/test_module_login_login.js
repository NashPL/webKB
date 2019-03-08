process.env.NODE_ENV = 'test';

const assert = require('assert');
const _Utils = require('./../application/_UTILS');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const should = chai.should();

const webkbuser = require('./../mdb_schema/webkbuser');

chai.use(chaiHttp);

describe('module/LOGIN/login.js', () => {
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
            "user_secret_q": "123",
            "user_secret_p": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"
        });
        user.save();
        done();
    });

    it('/POST / => It should attempt a login POST but with no data returing status 400', (done) => {
        chai.request(app)
            .post('/login')
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO POST DATA');
                done();
            }).catch((err) => {
                throw err;
            });
    });
    it('/POST / => It should attempt to login POST but with just a password returing status 400', (done) => {
        let json = {};
        json.psw = 'testuser'
        chai.request(app)
            .post('/login')
            .send(json)
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO USERNAME PROVIDED');
                done();
            }).catch((err) => {
                throw err;
            });
    });
    it('/POST / => It should attempt to login POST but with just a username returing status 400', (done) => {
        let json = {};
        json.usr = 'testuser'
        chai.request(app)
            .post('/login')
            .send(json)
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO PASSWORD PROVIDED');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST / => It should attempt to login POST', (done) => {
        let json = {};
        json.usr = 'testuser';
        json.psw = 'mochatesting197';
        chai.request(app)
            .post('/login')
            .send(json)
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.have.property('message').eql('YOU HAVE LOGGED IN');
                res.body.success.should.have.property('SESSION');
                res.body.success['SESSION'].should.have.property('cookie');
                res.body.success['SESSION'].should.have.property('user');
                res.body.success['SESSION'].should.have.property('active').eql(true);
                done();
            }).catch((err) => {
                throw(err);
            });
    });

});