const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const redis = require('redis');
const client = redis.createClient(6379, 'localhost');


const _USER = require('./../../application/_USER');
const _UTILS = require('./../../application/_UTILS');


const router = express.Router();

router.use('*', function(req, res, next) {
    if (!req.session.user) res.redirect('/');
    next();
})

router.get('/', function(req, res, next) {
    res.sendStatus(200);
});

router.post('/', function(req, res, next) {
    if (!req.body) return res.sendStatus(400);
    if (!req.body.email) return res.sendStatus(400);
    _USER.get_user_by_email(req.body.email).then(ret => {
        if (ret === false) res.sendStatus(400);
        let returnObject = {};
        returnObject.question = ret.user_secret_q;
        returnObject.email = ret.user_email;
        res.json(returnObject);
    });
});

router.post('/:email', function(req, res, next) {
    if (!req.body) return res.sendStatus(400);
    if (!req.body.email) return res.sendStatus(400);
    if (!req.body.anwser) return res.sendStatus(400);

    _USER.get_user_by_email(req.body.email).then(ret => {
        let hashedAnswer = _UTILS.getHashedValue(req.body.answer);
        if (hashedAnswer === ret.user_secret_q) {
            let hashedID = _UTILS.getHashedValue("FORGOTEN" + email);
            client.set(_UTILS.getHashedValue(hashedID), {
                "forgot_confirmed": true,
                "email": email
            });
            _USER.send_reset_psw_email(email, hashedID); //TODO: GET THAT FUNCTION IN
        }
    })
});

router.get('/:id', function(req, res, next) {
    res.sendStatus(200);
});

router.post('/:id', function(req, res, next) {
    let hashedObject = client.get(req.params.id);
    let query = {
        'user_email': hashedObject.email
    };
    let newData = {};
    newData.user_psw = _UTILS.getHashedValue(req.body.psw);
    webkbuser.findOneAndUpdate(query, newData, {}, function(err, doc) {
        if (err) return _UTILS.errorHandler(err, false, true, null, function(callbackResponse) {
            if (callbackResponse.status === 500) {
                res.sendStatus(500);
            }
        });
        res.sendStatus(200);
    });
});

module.exports = router;