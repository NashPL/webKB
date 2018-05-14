const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const redis = require('redis');
const client = redis.createClient(6379, 'localhost');


const _USER = require('./../../application/_USER');
const _UTILS = require('./../../application/_UTILS');
const webkbuser = require('./../../mdb_schema/webkbuser');


const router = express.Router();

router.use('*', function(req, res, next) {
    if (!req.session.user) res.redirect('/');
    next();
})

router.get('/', function(req, res, next) {
    res.sendStatus(200);
});

router.post('/', function(req, res, next) {
    if (req.body === undefined || (Object.keys(req.body).length === 0 && req.body.constructor === Object)) return res.status(400).json({
        'err': {
            'message': 'NO POST DATA'
        }
    });
    if (!req.body.email) return res.status(400).json({
        'err': {
            'message': 'NO EMAIL PROVIDED'
        }
    });
    _USER.get_user_by_email(req.body.email).then(ret => {
        if (!ret) return res.status(400).json({
            'err': {
                'message': 'WRONG EMAIL PROVIDED'
            }
        });
        let returnObject = {};
        returnObject.question = ret.user_secret_q;
        returnObject.email = ret.user_email;
        res.status(200).json(returnObject);
    });
});

router.post('/send', function(req, res, next) {
    if (req.body === undefined || (Object.keys(req.body).length === 0 && req.body.constructor === Object)) return res.status(400).json({
        'err': {
            'message': 'NO POST DATA'
        }
    });
    if (!req.body.email) return res.status(400).json({
        'err': {
            'message': 'NO EMAIL PROVIDED'
        }
    });
    if (!req.body.answer) return res.status(400).json({
        'err': {
            'message': 'NO ANWSER PROVIDED'
        }
    });
    _USER.get_user_by_email(req.body.email).then(ret => {
        let hashedAnswer = _UTILS.getHashedValue(req.body.answer);
        if (hashedAnswer === ret.user_secret_p) {
            let hashedID = "FORGOTEN" + ret.user_email;
            client.set(hashedID, JSON.stringify({
                "forgot_confirmed": true,
                "email": ret.user_email
            }));
            client.expire(hashedID, 120000);
            _USER.send_reset_psw_email(ret.user_email, hashedID);
            return res.status(200).json({
                'success': {
                    'message': 'OK'
                }
            });
        } else {
            return res.status(400).json({
                'err': {
                    'message': 'WRONG ANWSER GIVEN'
                }
            });
        }
    }).catch((err) => {
        return res.status(500).json(err);
    });
});

router.post('/:id', (req, res, next) => {
    if (req.body === undefined || (Object.keys(req.body).length === 0 && req.body.constructor === Object)) return res.status(400).json({
        'err': {
            'message': 'NO POST DATA'
        }
    });
    if (!req.body.psw) return res.status(400).json({
        'err': {
            'message': 'NO NEW PASSWORD PROVIDED'
        }
    });
    client.get(req.params.id, (err, hashedObject) => {
        if (!hashedObject) return res.status(400).json({
            'err': {
                'message': 'NO INFORMATION FOUND'
            }
        });
        hashedObject = JSON.parse(hashedObject);
        let query = {};
        query.user_email = hashedObject['email'];
        let newData = {};
        newData.user_psw = _UTILS.getHashedValue(req.body.psw);
        webkbuser.findOneAndUpdate(query, newData, {}, (err, doc) => {
            if (err) return _UTILS.errorHandler(err, false, true);
        });
        res.sendStatus(200);
    });
});
module.exports = router;