const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const _USER = require('./../../application/_USER');
const _SECURITY = require('./../../application/_SECURITY');
const _UTILS = require('./../../application/_UTILS');
const _REDIS = require('./../../application/_REDIS');

const webkbuser = require('./../../mdb_schema/webkbuser');

const client = _REDIS.new_client();

const router = express.Router();

router.get('/', (req, res, next) => {
    if (!req.session.user) res.redirect('/');
    res.sendStatus(200);
});

/**
 * A function which will create a new user. After a creation it will invoke send_conf_email.
 * If everything works it should return 200 status
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next NEXT function
 * @return {[status]}      Send statnus code back to a user
 */
router.post('/', (req, res, next) => {
    if (req.body === undefined || (Object.keys(req.body).length === 0 && req.body.constructor === Object)) return res.status(400).json({
        'err': {
            'message': "NO POST DATA"
        }
    });
    let signinObject = {};
    signinObject.user_forname = req.body.user_forname;
    signinObject.user_surname = req.body.user_surname;
    signinObject.dob = req.body.user_dob;
    signinObject.email = req.body.user_email;

    let user = new _USER();
    user.new_user(req.body.usr, req.body.psw, signinObject).then(async newUser => {
        if (newUser.status === false) return res.status(401).json(newUser);
        req.session.active = true;
        await webkbuser.findOne({
            'user_username': req.body.usr
        }).then(ret => {
            let uniqueID = _UTILS.getHashedValue(ret.user_email + Math.random());
            let userObject = ret;
            userObject.user_email_validation = uniqueID;
            userObject.user_username = ret.user_username;
            user.send_conf_emial(ret.user_email, userObject);
            req.session.user = ret;
            return res.status(200).json(newUser);
        }).catch(err => {
            if (err) {
                _UTILS.errorHanlder(err, false, true);
                return res.send(500).json(err);
            };
        });
    });
});

/**
 * Function to confirm user email address after registation.
 * It check for stored json file in Redis then it validates the record in mongo if the id is the same.
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next NEXT function
 * @return {[status]}      Send status code back to a user
 */
router.get('/confirm/:id', (req, res, next) => {
    let param = (req.param.id === '');
    if (param === '') return res.status(401).json({
        'err': {
            'message': "NOTHING FOUND"
        }
    });
    client.get(req.params.id, (err, result) => {
        let resultObject = JSON.parse(result);
        webkbuser.findOne({
            'user_username': resultObject.user_username
        }).exec((err, ret) => {
            if (!ret) return res.status(401).json({
                'err': {
                    'message': "NOTHING FOUND"
                }
            });
            if (resultObject.user_email !== ret.user_email) return res.status(401).json({
                'err': {
                    'message': "NO EMAIL FOUND"
                }
            });
            let query = {
                'user_username': ret.user_username
            };
            let newData = {};
            newData.user_email_validated = true;
            webkbuser.findOneAndUpdate(query, newData, {}, (err, doc) => {
                if (err) return _UTILS.errorHandler(err, false, true);
                res.status(200).json({
                    'success': {
                        'message': "EMAIL HAS BEEN CONFIRMED"
                    }
                });
            });
        });
        upsert: true
    });
})

module.exports = router;