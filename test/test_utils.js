process.env.NODE_ENV = 'test';

const assert = require('assert');
const _Utils = require('./../application/_UTILS');

describe('Application/_Utils.js', () => {
    it('FUNCTION getHashedValue() => It should return a hashed value generated from random number', (done) => {
        let result = _Utils.getHashedValue();
        if (result != undefined) {
            done();
        }
        if (err) return done(err);
    });

    it('FUNCTION getHashedValue("THIS IS A TEST") => It should return a hased value generated from String: "THIS IS A TEST"', (done) => {
        let result = _Utils.getHashedValue("THIS IS A TEST");
        assert.equal(result, 'f6b51a03debf680bdcc215f429eed499ef5933e759614da25ed44513e918561d');
        done();
    });

    it('FUNCTION toFile(directory, msg, callback) => It should save a text file into a log directory', (done) => {
        _Utils.toFile('/tmp/test_file.log', "THIS IS A TEST DATE AT: " + Date.now()).then(response => {
            assert.equal(response.status, 200);
            done();
        });

    });
})