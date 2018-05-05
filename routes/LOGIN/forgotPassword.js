const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const _USER = require('/srv/webkb_mean/application/_USER');

const router = express.Router();


//TODO: Design this module... May need to alter a user mongoo object to store some sort of security infor (question and awser ?)

router.use('*', function(req, res, next) {
    if (!req.session.user) res.redirect('/');
    next();
})

router.get('/', function(req, res, next) {
    res.sendStatus(200);
});

router.post('/', function(req, res, next) {
    if (!req.body) return res.sendStatu(400);
    if (!req.body.usr) return res.sendStatus(400);
    if (!req.body.psw) return res.sendStatus(400);
    let user = new _USER();
    let userLogin = user.login_user(req.body.usr, req.body.psw, function(ret) {
        if (ret === false) return res.sendStatus(401);
        req.session.active = true;
        req.session.user = ret;
        res.sendStatus(200);
    })
});

module.exports = router;