const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const _SECURITY = require('/srv/webkb_mean/application/_SECURITY');
const _UTILS = require('/srv/webkb_mean/application/_UTILS');

const webkbmodule = require('./../mdb_schema/webkbmodule');
const router = express.Router();

/**
 * Function creates a session on a visit
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[Function]}    Carry on with the route path
 */
router.use('*', function(req, res, next) {
    req.session.user = {};
    req.session.user.user_permission = ['*'];
    next();
})

/**
 * Function loads main index page
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @return {[type]}        Loads a index.html page
 */
router.get('/', function(req, res) {
    res.send("Welcome to this page for the first time!");
});

/**
 * Function it gets a module list from a datastore. It bases the result based on user session user_permission value.
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[object]}      Sends back the json with modules list
 */
router.get('/_json', function(req, res, next) {
    if (req.session.user == undefined) {
        res.sendStatus(403);
    }
    _SECURITY.check_user_access_all_modules(req.session.user).then(modules => {
        res.json(modules);
    }).catch(err => {
        let errorMsg = {};
        errorMsg.statusCode = 500;
        errorMsg.msg = err;
        res.json(errorMsg);
    });
});

/**
 * Function creates new module. Can be only accessed by a user with user_permission = admin/
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[type]}        Sends response status back to a user
 */
router.post('/_json', async function(req, res, next) {
    if (!req.body) return res.sendStatus(400);
    if (!_SECURITY.is_admin(req.session.user)) return res.sendStatus(403).end();
    const newModule = new webkbmodule(req.body);
    try {
        let responseMsg = {};
        newModule.save().then(response => {
            responseMsg.statusCode = 200;
            responseMsg.msg = response;
            res.json(responseMsg);
        }).catch(err => {
            responseMsg.statusCode = 500;
            responseMsg.msg = err;
            res.json(erroMresponseMsgsg);
        });
    } catch (err) {
        _UTILS.errorHandler(err, false, true);
    }
});

/**
 * Function which destroy session. It logs out the user from the platform
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[status]}      Sends back status to a user
 */
router.post('/logout', function(req, res, next) {
    if (!req.body) return res.sendStatus(400);
    req.session.destroy();
    res.sendStatus(200);
});

module.exports = router;