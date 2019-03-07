process.env.NODE_ENV = 'test';

const assert = require('assert');
const _Utils = require('./../application/_UTILS');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../app');
const should = chai.should();

const webkbuser = require('./../mdb_schema/webkbuser');

chai.use(chaiHttp);
chai.use(require('chai-expected-cookie'));

describe('index.js', () => {
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
            "user_secret_q": "595fb164ade516fec89f677c8bd8ff3e50e80ef703fd3bbf2a17eddd092a54bc",
            "user_secret_p": "123"
        });
        user.save();
        done();
    });

    it('/GET / => Access index page', (done) => {
        chai.request(app)
            .get('/')
            .then((res) => {
                res.should.have.status(200);
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/GET /_json => should return a list of module for basic user', (done) => {
        chai.request(app)
            .get('/_json')
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST /_json => POST request with no send json', () => {
        chai.request(app)
            .post('/_json')
            .then((res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('NO POST DATA');
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST /_json => POST data but not logged in as a admin', () => {
        let json = {};
        json.module_name = "TEST ENTRY";
        json.module_url = "/TEST_ENTRY";
        json.module_privilege = ['testentry', 'testentry2', 'testentry3'];
        chai.request(app)
            .post('/_json')
            .send(json)
            .then((res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.err.should.have.property('message').eql('ACCESS DENIED');
            }).catch((err) => {
                throw err;
            });
    });

    it('/POST /_json => POST data as a admin', (done) => {
        let json = {};
        json._id = "TEST_ENTRY";
        json.module_name = "TEST_ENTRY";
        json.module_url = "/TEST_ENTRY";
        json.module_privilege = ['testentry', 'testentry2', 'testentry3'];

        let loginInfo = {};
        loginInfo.usr = 'testuser';
        loginInfo.psw = 'mochatesting197';

        let agent = chai.request.agent(app);

        agent.post('/login')
            .send(loginInfo)
            .then((res) => {
                return agent.post('/_json')
                    .send(json)
                    .then((res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body['success'].should.have.property('message').eql('ENTRY HAS BEEN UPDATED');
                        done();
                    }).catch(function (err) {
                        throw err;
                    });
            });
    });

    it('/POST /logout => Logout a user by purging a session', (done) => {
        let loginInfo = {};
        loginInfo.usr = 'testuser';
        loginInfo.psw = 'mochatesting197';

        let agent = chai.request.agent(app);

        let json = {};
        json.logout = true;
        
        agent.post('/login')
            .send(loginInfo)
            .then((res) => {
                return agent.post('/logout')
                    .send(json)
                    .then((res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body['success'].should.have.property('message').eql('YOU HAVE LOGGED OUT');
                        done();
                    })
            }).catch((err) => {
                done(err);
            });
    });
    it('/POST /logout => Attempt logout a user but dont send any post data to confirm the action', (done) => {
        let loginInfo = {};
        loginInfo.usr = 'testuser';
        loginInfo.psw = 'mochatesting197';
        let agent = chai.request.agent(app);
        agent.post('/login')
            .send(loginInfo)
            .then((res) => {
                return agent.post('/logout')
                    .then((res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body['err'].should.have.property('message').eql('NO POST DATA');
                        done();
                    }).catch(function (err) {
                        throw err;
                    });
            });
    });
    it('/POST /logout => Attempt logout a user but send post data with wrong confirmation of an action', (done) => {
        let loginInfo = {};
        loginInfo.usr = 'testuser';
        loginInfo.psw = 'mochatesting197';
        let agent = chai.request.agent(app);
        let json = {};
        json.test = false;
        agent.post('/login')
            .send(loginInfo)
            .then((res) => {
                return agent.post('/logout')
                    .send(json)
                    .then((res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body['err'].should.have.property('message').eql('WRONG POST DATA');
                        done();
                    }).catch(function (err) {
                        throw err;
                    });
            });
    });
    it('/POST /logout => Attempt logout a user but send post data with correct confirmation of an action', (done) => {
        let loginInfo = {};
        loginInfo.usr = 'testuser';
        loginInfo.psw = 'mochatesting197';
        let agent = chai.request.agent(app);
        let json = {};
        json.logout = true;
        agent.post('/login')
            .send(loginInfo)
            .then((res) => {
                return agent.post('/logout')
                    .send(json)
                    .then((res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body['success'].should.have.property('message').eql('YOU HAVE LOGGED OUT');
                        done();
                    })
            }).catch(function (err) {
                done(err);
            });
    });

    after('Remove reddis entry', (done) => {
        webkbuser.remove({
            "user_username": "testuser"
        }, (err) => {
            if (err) throw err;
        });
        done();
    });
});