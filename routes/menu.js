const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const _SECURITY = require('../application/_SECURITY');
const _UTILS = require('../application/_UTILS');
const _REDIS = require('../application/_REDIS');

const webkbmodule = require('../mdb_schema/webkbmodule');
const client = _REDIS.new_client();

const router = express.Router();

const menuJSON =  JSON.parse(fs.readFileSync('./config/configFiles/menu.json', 'utf8'));

/**
 * Function returns menu structore of the application
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[Function]}    Carry on with the route path
 */
router.get('/', function (req, res, next) {
    res.status(200).json(menuJSON);
})
module.exports = router;