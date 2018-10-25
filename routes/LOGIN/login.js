const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const _USER = require('./../../application/_USER');
const _UTILS = require('./../../application/_UTILS');


const router = express.Router();

/**
 * Function => if user does not have session it redirects back to '/' page
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[Function]}    Carry on with a code
 */
router.use('*', function (req, res, next) {
    if (!req.session.user) res.redirect('/');
    next();
})

/**
 * Function if hit '/' send status code
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[status]}      Sends status code back to a user
 */
router.get('/', function (req, res, next) {
    res.sendStatus(200);
});

/**
 * Function preforms login action based on posted variables
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[status]}      Sends status code back to a user
 */
router.post('/', async (req, res, next) => {
    if (req.body === undefined || (Object.keys(req.body).length === 0 && req.body.constructor === Object)) return res.status(400).json({
        'err': {
            'message': "NO POST DATA"
        }
    });
    if (!req.body.usr) return res.status(400).json({
        'err': {
            'message': "NO USERNAME PROVIDED"
        }
    });
    if (!req.body.psw) return res.status(400).json({
        'err': {
            'message': "NO PASSWORD PROVIDED"
        }
    });
    let user = new _USER();
    await user.login_user(req.body.usr, req.body.psw).then(ret => {
        if (ret === false) return res.sendStatus(401);
        req.session.active = true;
        req.session.user = ret;
        console.log(req.sessionID);
        return res.status(200).json({
            'success': {
                'message': 'YOU HAVE LOGGED IN',
                'SESSION': req.session,
                'token': req.sessionID
            }
        });
    }).catch(err => {
        _UTILS.errorHandler(err, false, true);
        return res.status(500).json({
            'err': {
                'message': err
            }
        });
    });
});

module.exports = router;