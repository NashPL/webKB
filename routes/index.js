const express = require('express');
const router = express.Router();
const mongodb = require ('./../config/mongodb');

let mongodbConnection = new mongodb("webkb");
mongodbConnection.connectToBucket();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

module.exports = router;
