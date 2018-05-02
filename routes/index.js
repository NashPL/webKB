const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const _SECURITY = require('/srv/webkb_mean/application/_SECURITY');
const _UTILS = require('/srv/webkb_mean/application/_UTILS');

const webkbSchema = require('./../mdb_schema/webKB-main');
const router = express.Router();

router.use('*', function(req, res, next) {
    req.session.user = {};
    req.session.user.privilege = '*';
    next();
})

/* GET home page. */
router.get('/', function(req, res) {
    res.send("Welcome to this page for the first time!");
});

router.get('/_json', function(req, res, next) {
    if (req.session.user == undefined) {
        res.sendStatus(403);
    }
    webkbSchema.find({}, function(err, ret) {
        if (err) {
            _UTILS.errorHanlder(err, false, true, null);
        }
        let returnVal = _SECURITY.check_user_access(req.session.user, ret);
        res.json(returnVal);
    })
});

router.post('/_json', function(req, res, next) {
    if (!req.body) return res.sendStatus(400);
    if (!_SECURITY.is_admin(req.session.user)) return res.sendStatus(403).end();
    let newModule = new webkbSchema(req.body);
    newModule.save(function(err) {
        if (err) {
            _UTILS.errorHanlder(err, false, true, null);
        } else {
            res.status(200).json({
                message: 'OK'
            });
        }
    });
});

router.post('/logout', function(req, res, next) {
    if (!req.body) return res.sendStatus(400);
    req.session.destroy();
    res.sendStatus(200);
});

module.exports = router;