const _SECURITY = require('./_SECURITY');
const mongoose = require('mongoose');
const webkbuser = require('./../mdb_schema/webKB-users');

/**
 * _USER CLASS
 * A class designed to handle new and exsiting users. It can handle new_user sign in, log in, information change
 */
modules.exports = class _USER {
    /**
     * _USER constructor handles incoming new user events
     * @param {string} type              Holds a type of user which access the class
     * @param {string} username          Holds a username details
     * @param {string} psw               Holds a password details
     * @param {object} [userObject=null] Holds any other information we need for a user (new or exsiting)
     */
    constructor(type, username, psw, userObject = null) {
        if (type === "LOGIN") {
            //TODO: GET USER FROM DB
        } else if (type === "SIGNIN") {
            new_user(usrname, psw, userObject);
        } else {
            return "NO USER TYPE";
        }
    }

    /**
     * A new_user function which handles all signins into the platform, It checks the details and saves them into mongodb database
     * @param  {[string]} username    Holds a usename details
     * @param  {[string]} psw         Holds a password information
     * @param  {[object]} user_object Holds any other user_object information
     * @return {[object]}             return a mongodb result state which contains msg if the user has been saved or not
     *
     * TODO: user_permission might need extra depending on schema of modules we want to give them access to
     */
    new_user(username, psw, user_object) {
        // Assign new information for a _USER object
        this.user_username = username;
        this.user_psw = _SECURITY.string_to_bcrypt(psw);
        this.user_forname = user_object['user_forname'];
        this.user_surname = user_object['user_surname'];
        this.user_dob = user_object['dob'];
        this.user_email = user_object['email'];
        this.user_permission = "*";

        //Create mongodb object for webkbuser
        let webkbuser = new webkbuser({
            user_username: this.user_username,
            user_psw: this.user_psw,
            user_forname: this.user_email,
            user_surname: this.user_surname,
            user_email: this.user_email,
            user_dob: this.user_dob,
            user_permission: this.user_permission
        });
        //Save new user. If err occurs through out error
        //TODO: need error handling in _UTILS.
        webkbuser.save(function(err) {
            if (err) return err;
            console.loge("SAVED " + this);
        });

        return new_user;
    }
    /**
     * Login function which will handle exsiting users login event
     * @param  {string} username Holds a username details
     * @param  {string} psw      Holds a password details
     * @return {object}          Returns object with information if user has logged in or not
     */
    login_user(username, psw) {
        //TODO: mongodb login pull data;
    }

    get_user_permission() {
        return this.user_permission();
    }

}