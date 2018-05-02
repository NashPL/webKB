const _SECURITY = require('./_SECURITY');
const _UTILS = require('./_UTILS');
const mongoose = require('mongoose');
const webkbuser = require('./../mdb_schema/webkbuser');

/**
 * _USER CLASS
 * A class designed to handle new and exsiting users. It can handle new_user sign in, log in, information change
 */
module.exports = class _USER {
    /**
     * _USER constructor handles incoming new user events
     * @param {string} type              Holds a type of user which access the class
     * @param {string} username          Holds a username details
     * @param {string} psw               Holds a password details
     * @param {object} [userObject=null] Holds any other information we need for a user (new or exsiting)
     */
    constructor() {}

    /**
     * A new_user function which handles all signins into the platform, It checks the details and saves them into mongodb database
     * @param  {[string]} username    Holds a usename details
     * @param  {[string]} psw         Holds a password information
     * @param  {[object]} user_object Holds any other user_object information
     * @return {[object]}             return a mongodb result state which contains msg if the user has been saved or not
     *
     */
    new_user(username, psw, user_object, callback) {
        // Assign new information for a _USER object
        let user_username = username;
        let user_psw = _SECURITY.string_to_sha1(psw);
        let user_forname = user_object['user_forname'];
        let user_surname = user_object['user_surname'];
        let user_dob = user_object['dob'];
        let user_email = user_object['email'];
        let user_permission = '';
        if (!user_object['user_permission']) {
            user_permission = "*";
        } else {
            user_permission = user_object['user_permission'];
        }

        webkbuser.findOne({
            $or: [{
                    'user_username': username
                },
                {
                    'use_email': user_object['email']
                }
            ]
        }).exec(function(err, ret) {
            if (err) _UTILS.errorHanlder(err, false, true);
            if (ret) {
                callback({
                    "message": "User already exsist",
                    "status": false
                });
            } else {
                //Create mongodb object for webkbuser
                let userObject = new webkbuser({
                    user_username: user_username,
                    user_psw: user_psw,
                    user_forname: user_forname,
                    user_surname: user_surname,
                    user_email: user_email,
                    user_dob: user_dob,
                    user_permission: user_permission
                });
                userObject.save(function(err) {
                    if (err) _UTILS.errorHanlder(err, false, true);

                    callback(true);
                });
            }
        });

    }
    /**
     * Login function which will handle exsiting users login event
     * @param  {string} username Holds a username details
     * @param  {string} psw      Holds a password details
     * @return {object}          Returns object with information if user has logged in or not
     */

    login_user(username, psw, callback) {
        let hashedPsw = _SECURITY.string_to_sha1(psw);
        webkbuser.findOne({
            'user_username': username
        }).exec(function(err, ret) {
            if (err) return _UTILS.errorHanlder(err, false, true, null);
            if (ret.user_psw !== hashedPsw) callback(false);
            callback(ret);
        });
    }

    get_user_permission() {
        return this.user_permission();
    }

}