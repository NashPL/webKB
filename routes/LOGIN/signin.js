const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const redis = require('redis');
const client = redis.createClient(6379, 'localhost');

const _USER = require('/srv/webkb_mean/application/_USER');
const _SECURITY = require('/srv/webkb_mean/application/_SECURITY');
const _UTILS = require('/srv/webkb_mean/application/_UTILS');

const webkbuser = require('./../../mdb_schema/webkbuser');

const router = express.Router();

router.get('/', function(req, res, next) {
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
router.post('/', function(req, res, next) {
    if (!req.body) return res.sendStatu(400);

    let signinObject = {};
    signinObject.user_forname = req.body.user_forname;
    signinObject.user_surname = req.body.user_surname;
    signinObject.dob = req.body.user_dob;
    signinObject.email = req.body.user_email;

    let user = new _USER();
    user.new_user(req.body.usr, req.body.psw, signinObject).then(async newUser => {
        console.log(newUser);
        if (newUser === false) return res.sendStatus(401);
        if (newUser.status === false) return res.json(newUser);
        req.session.active = true;
        await webkbuser.findOne({
            'user_username': req.body.usr
        }).then(ret => {
            let uniqueID = _UTILS.getHashedValue(ret.user_email + Math.random());
            let userObject = ret;
            userObject.user_email_validation = uniqueID;
            user.send_conf_emial(ret.user_email, userObject);
            req.session.user = ret;
            res.sendStatus(200);
        }).catch(err => {
            if (err) {
                _UTILS.errorHanlder(err, false, true);
                res.sendStatus(500);
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
router.get('/confirm/:id', function(req, res, next) {
    client.get(req.params.id, function(err, result) {
        let resultObject = JSON.parse(result);
        webkbuser.findOne({
            'user_username': resultObject.user_username
        }).exec(function(err, ret) {
            if (!ret) return res.sendStatus(401);
            if (resultObject.user_email !== ret.user_email) return res.sendStatu(401);
            let query = {
                'user_username': ret.user_username
            };
            let newData = {};
            newData.user_email_validated = true;
            webkbuser.findOneAndUpdate(query, newData, {}, function(err, doc) {
                if (err) return _UTILS.errorHandler(err, false, true, null, function(callbackResponse) {
                    if (callbackResponse.status === 500) {
                        res.sendStatus(500);
                    }
                });
                res.sendStatus(200);
            });
        });
        upsert: true
    });
})

module.exports = router;