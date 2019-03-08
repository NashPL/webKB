process.env.NODE_ENV = 'test';

const assert = require('assert');
const _Utils = require('./../application/_UTILS');
const chai = require('chai');
const chaiHttp = require('chai-http');
const redis = require('redis');
const client = redis.createClient(6379, 'localhost');
const webkbuser = require('./../mdb_schema/webkbuser');
const _UTILS = require('./../application/_UTILS');

const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('module/LOGIN/forgotPassword.js', () => {
    let hashedID;
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
            "user_secret_p": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
            "user_secret_q": "123"
        });
        user.save();
        hashedID = "FORGOTEN" + "kbuczynski@outlook.com";
        client.set(hashedID, JSON.stringify({
            "forgot_confirmed": true,
            "email": "kbuczynski@outlook.com"
        }));
        done();
    });

    it('/GET / => Access index page', (done) => {
        chai.request(app)
            .get('/forgotPassword')
            .then((res) => {
                res.should.have.status(200);
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST / => Post request with no send json', (done) => {
        chai.request(app)
            .post('/forgotPassword')
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO POST DATA');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST / => POST request with wrong data', (done) => {
        chai.request(app)
            .post('/forgotPassword')
            .send({
                'test': 'test'
            })
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO EMAIL PROVIDED');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST / => POST request with wrong email', (done) => {
        chai.request(app)
            .post('/forgotPassword')
            .send({
                'email': 'this is a wrong email'
            })
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('WRONG EMAIL PROVIDED');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST / => POST request providing a valid email', (done) => {
        chai.request(app)
            .post('/forgotPassword')
            .send({
                'email': 'kbuczynski@outlook.com'
            })
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('question');
                res.body.should.have.property('email');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST /:email => Post request with no send json', (done) => {
        chai.request(app)
            .post('/forgotPassword/send')
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO POST DATA');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST /:email => Post request with no email provided', (done) => {
        chai.request(app)
            .post('/forgotPassword/send')
            .send({
                'anwser': '123'
            })
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO EMAIL PROVIDED');
                done();
            }).catch((err) => {
                throw err;
            })
    });

    it('/POST /send => Post request with no anwser provided', (done) => {
        const json = {'email': 'kbuczynski@outlook.com'};
        chai.request(app)
            .post('/forgotPassword/send')
            .send(json)
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO ANWSER PROVIDED');
                done();
            }).catch((err) => {
                throw err;
            });
            
    });

    it('/POST /send => Post request with wrong anwser given', (done) => {
        const json = { 'email': 'kbuczynski@outlook.com', 'answer': '123'};
        chai.request(app)
            .post('/forgotPassword/send')
            .send(json)
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('WRONG ANWSER GIVEN');
                done();
            }).catch((err) => {
                done(err);
            });
            
    });

    it('/POST /send => Post request send correct data', (done) => {
        chai.request(app)
            .post('/forgotPassword/send')
            .send({
                'email': 'kbuczynski@outlook.com',
                'answer': '1234'
            })
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.have.property('message').eql('OK');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST /:id => POST request with no json data', (done) => {
        chai.request(app)
            .post('/forgotPassword/' + hashedID)
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO POST DATA');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST /:id => POST request no password parameter provided', (done) => {
        chai.request(app)
            .post('/forgotPassword/' + hashedID)
            .send({
                'test': 'test'
            })
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO NEW PASSWORD PROVIDED');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST /:id => POST provide wrong hashedID', (done) => {
        chai.request(app)
            .post('/forgotPassword/' + hashedID + 1)
            .send({
                'psw': '1234'
            })
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO INFORMATION FOUND');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST /:id => POST correct information', (done) => {
        chai.request(app)
            .post('/forgotPassword/' + hashedID)
            .send({
                'psw': '1234'
            })
            .then((res) => {
                res.should.have.status(200);
                webkbuser.findOne({
                    'user_username': 'testuser'
                }).then((ret) => {
                    assert.equal(ret.user_psw, _UTILS.getHashedValue('1234'));
                });
                done();
            }).catch((err) => {
                throw err;
            });
    });

    after('Remove reddis entry', (done) => {
        client.del(hashedID);
        client.del("TEST_KEY_REDIS_123");
        const query = {"user_username": "testuser"};
        webkbuser.deleteOne(query)
        .then((res) => {
            done(res.deleteCount);
        })
        .catch((err) => {
            throw err;
        });
    });
});