const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync('/srv/webkb_mean/config/configFiles/database.json', 'utf8'));
mongoose.connect('mongodb://' + db['mongodb']['url'] + '/webKB-main');

const webkbSchema = require('./../mdb_schema/webKB-main');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.get('/_json', function(req, res, next) {
  //TODO: Check for user privilege and return appropriet data (maybe diffrent query ?);
  webkbSchema.find({}, function(err, ret) {
    if (err) {
      console.log(err);
    }
    res.json(ret);
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
