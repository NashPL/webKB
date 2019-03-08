const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const _SECURITY = require('../application/_SECURITY');
const _UTILS = require('../application/_UTILS');
const _REDIS = require('../application/_REDIS');

const webkbmodule = require('../mdb_schema/webkbmodule');
const client = _REDIS.new_client();

const router = express.Router();

/**
 * Function creates a session on a visit
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[Function]}    Carry on with the route path
 */
router.use('*', function (req, res, next) {
    if (!req.session.user) {
        req.session.user = {};
        req.session.user.user_permission = ['*'];
    }
    next();
})

/**
 * Function loads main index page
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @return {[type]}        Loads a index.html page
 */
router.get('/', function (req, res) {
    res.status(200).send("Welcome to this page for the first time!");
});

/**
 * Function it gets a module list from a datastore. It bases the result based on user session user_permission value.
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[object]}      Sends back the json with modules list
 */
router.get('/_json', function (req, res, next) {
    if (req.session.user == undefined) {
        res.sendStatus(403);
    }
    _SECURITY.check_user_access_all_modules(req.session.user).then(modules => {
        res.status(200).json(modules);
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
router.post('/_json', async (req, res, next) => {
    if (req.body === undefined || (Object.keys(req.body).length === 0 && req.body.constructor === Object)) return res.status(400).json({
        'err': {
            'message': "NO POST DATA"
        }
    });
    if (!_SECURITY.is_admin(req.session.user)) return res.status(403).json({
        'err': {
            'message': 'ACCESS DENIED'
        }
    });
    const moduleQuery = {
        _id: req.body._id
    };
    try {
        let responseMsg = {};
        let module = await webkbmodule.find(moduleQuery);
        webkbmodule.findOneAndUpdate(moduleQuery, req.body, {
            upsert: true
        }, (err, ret) => {
            if (err) return res.status(500).json({
                'err': {
                    'message': err
                }
            });
            return res.status(200).json({
                'success': {
                    'message': "ENTRY HAS BEEN UPDATED"
                }
            })
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
router.post('/logout', function (req, res, next) {
    if (req.body === undefined || (Object.keys(req.body).length === 0 && req.body.constructor === Object)) return res.status(400).json({
        'err': {
            'message': 'NO POST DATA'
        }
    });
    if (!req.body.logout || req.body.logout === false) return res.status(400).json({
        'err': {
            'message': 'WRONG POST DATA'
        }
    });
    if (!req.sessionID || req.sessionID === undefined) return res.status(400).json({
        'err': {
            'message': 'WRONG POST DATA'
        }
    });
    client.del(req.sessionID);
    req.session.destroy();
    res.status(200).json({
        'success': {
            'message': 'YOU HAVE LOGGED OUT'
        }
    });
});

module.exports = router;