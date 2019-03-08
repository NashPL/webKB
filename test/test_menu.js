process.env.NODE_ENV = 'test';

const assert = require('assert');
const _Utils = require('../application/_UTILS');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../app');
const should = chai.should();

const webkbuser = require('../mdb_schema/webkbuser');

chai.use(chaiHttp);

describe('menu.js', () => {
    it('/GET / => Get Menu JSON', (done) => {
        chai.request(app)
            .get('/menu')
            .then((res) => {
                should.exist(res.body);
                res.body.should.have.property('title');
                res.body.should.have.property('router');
                res.should.have.status(200);
                done();
            }).catch((err) => {
                throw err;
            });
    });
});