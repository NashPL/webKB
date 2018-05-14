process.env.NODE_ENV = 'test';

const assert = require('assert');
const _Utils = require('./../application/_UTILS');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('module/LOGIN/login.js', () => {
    it('/POST /login => It should attempt a login POST but with no data returing status 400', (done) => {
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
    it('/POST /login => It should attempt to login POST but with just a password returing status 400', (done) => {
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
    it('/POST /login => It should attempt to login POST but with just a username returing status 400', (done) => {
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

    it('/POST /login => It should attempt to login POST', (done) => {
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
                throw err;
            });
    });

});