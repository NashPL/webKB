const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const _USER = require('/srv/webkb_mean/application/_USER');
const _SECURITY = require('/srv/webkb_mean/application/_SECURITY');
const _UTILS = require('/srv/webkb_mean/application/_UTILS');

const webkbuser = require('./../../mdb_schema/webkbuser');

const router = express.Router();

router.use('*', function(req, res, next) {
    if (!req.session.user) res.redirect('/');
    next();
})

router.get('/', function(req, res, next) {
    res.sendStatus(200);
});


//TODO: TEST
router.post('/', function(req, res, next) {
    if (!req.body) return res.sendStatu(400);

    let signinObject = {};
    signinObject.user_forname = req.body.user_forname;
    signinObject.user_surname = req.body.user_surname;
    signinObject.dob = req.body.user_dob;
    signinObject.email = req.body.user_email;

    let user = new _USER();
    let userLogin = user.new_user(req.body.usr, req.body.psw, signinObject, function(ret) {
        if (ret === false) return res.sendStatus(401);
        if (ret.status === false) return res.json(ret);
        req.session.active = true;
        webkbuser.findOne({
            'user_username': req.body.usr
        }).exec(function(err, ret2) {
            if (err) return _UTILS.errorHanlder(err, false, true, null);
            req.session.user = ret2;
            res.sendStatus(200);
        });
    })
});

module.exports = router;