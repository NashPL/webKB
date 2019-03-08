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

describe('module/LOGIN/signing.js', () => {
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

    beforeEach('set reddi key', (done) => {
        let object = {};
        object.user_username = "test_signing_user";
        object.user_email_validation = "TEST_KEY_REDIS_123";
        object.user_email = "test@email.com";
        client.set('TEST_KEY_REDIS_123', JSON.stringify(object));
        done();

    });
    it('/GET / => Access index page', (done) => {
        chai.request(app)
            .get('/signin')
            .then((res) => {
                res.should.have.status(200);
                done();
            }).catch((err) => {
                throw err;
            })
    });

    it('/POST / => New user with no post data', (done) => {
        chai.request(app)
            .post('/signin')
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO POST DATA');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST / => New user try adding exsiting user (username)', (done) => {
        let json = {};
        json.user_forname = "TEST_USER_FORNAME";
        json.user_surname = "TEST_USER_SURNAME";
        json.user_dob = "2018-01-1";
        json.user_email = "test@email.com";
        json.user_secret_p = "ppp";
        json.user_secret_q = "qqq";
        json.psw = "mochatesting197";
        json.usr = "testuser"; //Exsisitng username

        chai.request(app)
            .post('/signin')
            .send(json)
            .then((res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('USER ALREADY EXSIST');
                done();
            });
    });

    it('/POST / => New user try adding exsiting user (email)', (done) => {
        let json = {};
        json.user_forname = "TEST_USER_FORNAME";
        json.user_surname = "TEST_USER_SURNAME";
        json.user_dob = "2018-01-1";
        json.user_email = "kbuczynski@outlook.com"; //Exsisting email
        json.user_secret_p = "ppp";
        json.user_secret_q = "qqq";
        json.psw = "mochatesting197";
        json.usr = "test_signing_user";

        chai.request(app)
            .post('/signin')
            .send(json)
            .then((res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('USER ALREADY EXSIST');
                done();
            });
    });

    it('/POST / => New user try adding new user', (done) => {
        let json = {};
        json.user_forname = "TEST_USER_FORNAME";
        json.user_surname = "TEST_USER_SURNAME";
        json.user_dob = "2018-01-1";
        json.user_email = "test@email.com";
        json.user_secret_p = "ppp";
        json.user_secret_q = "qqq";
        json.psw = "mochatesting197";
        json.usr = "test_signing_user";

        chai.request(app)
            .post('/signin')
            .send(json)
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('NEW USER CREATED');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/GET /confirm/:id => Confirm user email dont pass an id', (done) => {
        chai.request(app)
            .get('/signin/confirm/')
            .then((res) => {
                res.should.have.status(404);
                done();
            }).catch((err) => {
                throw err;
            })
    });

    it('/GET /confirm/:id => Confirm user email dont correct email', (done) => {
        let object = {};
        object.user_username = "test_signing_user";
        object.user_email_validation = "TEST_KEY_REDIS_123";
        object.user_email = "nothign there";
        client.set('TEST_KEY_REDIS_123', JSON.stringify(object));
        let id = "TEST_KEY_REDIS_123";
        chai.request(app)
            .get('/signin/confirm/' + id)
            .then((res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO EMAIL FOUND');
                done();
            }).catch((err) => {
                throw err;
            })
    });

    it('/GET /confirm/:id => Confirm user email', (done) => {
        let id = "TEST_KEY_REDIS_123";
        chai.request(app)
            .get('/signin/confirm/' + id)
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.have.property('message').eql('EMAIL HAS BEEN CONFIRMED');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    after('Remove reddis entry', (done) => {
        client.del("TEST_KEY_REDIS_123");
        webkbuser.remove({
            "user_username": "test_signing_user"
        }, (err) => {
            if (err) throw err;
        });
        webkbuser.remove({
            "user_username": "testuser"
        }, (err) => {
            if (err) throw err;
        });
        done();
    });
});