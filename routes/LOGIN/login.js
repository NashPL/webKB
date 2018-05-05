const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const _USER = require('/srv/webkb_mean/application/_USER');

const router = express.Router();

/**
 * Function => if user does not have session it redirects back to '/' page
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[Function]}    Carry on with a code
 */
router.use('*', function(req, res, next) {
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
router.get('/', function(req, res, next) {
    res.sendStatus(200);
});

/**
 * Function preforms login action based on posted variables
 * @param  {[object]} req  REQUEST object
 * @param  {[object]} res  RESPONSE object
 * @param  {Function} next FUNCTION next
 * @return {[status]}      Sends status code back to a user
 */
router.post('/', async function(req, res, next) {
    if (!req.body) return res.sendStatu(400);
    if (!req.body.usr) return res.sendStatus(400);
    if (!req.body.psw) return res.sendStatus(400);
    let user = new _USER();
    await user.login_user(req.body.usr, req.body.psw).then(ret => {
        if (ret === false) return res.sendStatus(401);
        req.session.active = true;
        req.session.user = ret;
        res.sendStatus(200);
    }).catch(err => {
        _UTILS.errorHandler(err, false, true);
        res.sendStatus(500);
    });
});

module.exports = router;