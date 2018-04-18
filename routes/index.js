const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const _SECURITY = require('/srv/webkb_mean/application/_SECURITY.JS');

const db = JSON.parse(fs.readFileSync('/srv/webkb_mean/config/configFiles/database.json', 'utf8'));
mongoose.connect('mongodb://' + db['mongodb']['url'] + '/webKB-main');

const webkbSchema = require('./../mdb_schema/webKB-main');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    privilege: "*"
    req.session.user = {};
    req.session.browserInformation = req.headers['user-agent'];
    res.render('index.html');
});

router.get('/_json', function(req, res, next) {
    webkbSchema.find({}, function(err, ret) {
        if (err) {
            console.log(err);
        }
        req.session.user = {
            privilege: "*"
        }
        let returnVal = _SECURITY.check_user_access(req.session.user, ret);
        res.json(returnVal);
    })
});

router.post('/_json', function(req, res, next) {
    //TODO: Only Admin Developers and Post here
    if (!req.body) return res.sendStatus(400)
    let newModule = new webkbSchema(req.body);
    newModule.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send(200);
        }
    });
});

module.exports = router;