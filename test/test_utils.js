const assert = require('assert');
const _Utils = require('/srv/webkb_mean/application/_Utils');

describe('Application/_Utils.js', function() {
    describe('function getHashedValue()', function() {
        it('It should return a hashed value generated from random number', function(done) {
            let result = _Utils.getHashedValue();
            if (result != undefined) {
                done();
            }
            if (err) return done(err);
        })
    })
    describe('function getHashedValue("THIS IS A TEST")" ', function() {
        it('It should return a hased value generated from Strin: "THIS IS A TEST"', function() {
            let result = _Utils.getHashedValue("THIS IS A TEST");
            assert.equal(result, 'f6b51a03debf680bdcc215f429eed499ef5933e759614da25ed44513e918561d');
        })
    })

    describe('function toFile(directory, msg, callback)', function() {
        it('It should save a text file into a log directory', function() {
            _Utils.toFile('/tmp/test_file.log', "THIS IS A TEST DATE AT: " + Date.now(), function(response) {
                assert.equal(response.status, 200);
            });

        })
    })
})