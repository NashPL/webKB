const _SECURITY = require('./_SECURITY');
const _UTILS = require('./_UTILS');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const redis = require('redis');
const client = redis.createClient(6379, 'localhost');


const webkbuser = require('./../mdb_schema/webkbuser');

/**
 * _USER CLASS
 * A class designed to handle new and exsiting users. It can handle new_user sign in, log in, information change
 */
module.exports = class _USER {
    constructor() {}

    /**
     * A new_user function which handles all signins into the platform, It checks the details and saves them into mongodb database
     * @param  {[string]} username    Holds a usename details
     * @param  {[string]} psw         Holds a password information
     * @param  {[object]} user_object Holds any other user_object information
     * @return {[object]}             return a mongodb result state which contains msg if the user has been saved or not
     *
     */
    async new_user(username, psw, user_object) {
        // Assign new information for a _USER object
        let user_username = username;
        let user_psw = _UTILS.getHashedValue(psw);
        let user_forname = user_object['user_forname'];
        let user_surname = user_object['user_surname'];
        let user_dob = user_object['dob'];
        let user_email = user_object['email'];
        let user_permission = '';
        let user_secret_p = user_object['user_secret_p'];
        let user_secret_q = _UTILS.getHashedValue(user_object['user_secret_q']);

        if (!user_object['user_permission']) {
            user_permission = "*";
        } else {
            user_permission = user_object['user_permission'];
        }
        let user = webkbuser.findOne({
            $or: [{
                    'user_username': username
                },
                {
                    'user_email': user_object['email']
                }
            ]
        }).then(async ret => {
            if (ret) {
                return {

                    "message": "USER ALREADY EXSIST",
                    "status": false
                };
            } else {
                //Create mongodb object for webkbuser
                let userObject = new webkbuser({
                    user_username: user_username,
                    user_psw: user_psw,
                    user_forname: user_forname,
                    user_surname: user_surname,
                    user_email: user_email,
                    user_dob: user_dob,
                    user_permission: user_permission,
                    user_email_validated: false,
                    user_secret_p: user_secret_p,
                    user_secret_q: user_secret_q
                });
                await userObject.save();
                return {

                    'message': "NEW USER CREATED",
                    'data': userObject

                }
            }
        }).catch(err => {
            _UTILS.errorHandler(err, false, true);
            return err;
        });
        return user;
    }
    /**
     * Login function which will handle exsiting users login event
     * @param  {string} username Holds a username details
     * @param  {string} psw      Holds a password details
     * @return {object}          Returns object with information if user has logged in or not
     */

    async login_user(username, psw) {
        let hashedPsw = _UTILS.getHashedValue(psw);
        let user = await webkbuser.findOne({
            'user_username': username
        }).then(user => {

            if (!user) return false;
            if (user === null) return false;
            if (user.user_psw !== hashedPsw) return false;
            if (user.user_psw === hashedPsw) return user;
        }).catch(err => {
            _UTILS.errorHandler(err, false, true);
        });
        if (user === false) return false;
        let returnObject = {};
        returnObject.user_username = user.user_username;
        returnObject.user_permission = user.user_permission;
        returnObject.user_email = user.user_email;
        return returnObject;
    }

    /**
     * A function which sends a confirmation email after new user sign in into the platform
     * @param  {[string]} email  Holds a recipent email address
     * @param  {[object]} object Holds any additional information which will be used to send a email
     * @return {[null]}        does not return anything
     */
    async send_conf_emial(email, object) {
        let transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'simplywebkb@outlook.com',
                pass: '7arIpyKecp'
            }
        });

        let mailOptions = {
            from: 'simplywebkb@outlook.com',
            to: email,
            subject: 'SimplyWebKB email confirmation',
            html: '<h1>Welcome</h1><p>To validate the email please follow the link:</p><br/>' +
                '<p><a href="http://localhost:3000/signin/confirm/' + object.user_email_validation + '"</a>http://localhost:3000/signin/confirm/' + object.user_email_validation + '</p>'
        };

        await transporter.sendMail(mailOptions, async function (err, info) {
            if (err) {
                _UTILS.errorHandler(err, false, true, null, function (callbackResponse) {
                    if (callbackResponse.status === 500) {
                        console.log(callbackResponse.msg);
                    }
                });
            } else {
                console.log('Email sent: ' + info.response);
                client.set(object.user_email_validation, JSON.stringify(object));
            }
        });
    }

    static async get_user_by_email(email, object) {
        let user;
        try {
            user = await webkbuser.findOne({
                'user_email': email
            });
        } catch (err) {
            console.log(err);
            _UTILS.errorHandler(err, false, true);
            user = err;
        }
        return user;
    }

    static async send_reset_psw_email(email, hashedID) {
        let transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'simplywebkb@outlook.com',
                pass: '7arIpyKecp'
            }
        });

        let mailOptions = {
            from: 'simplywebkb@outlook.com',
            to: email,
            subject: 'SimplyWebKB email confirmation',
            html: '<h1>Welcome</h1><p>To validate the email please follow the link:</p><br/>' +
                '<p><a href="http://localhost:3000/forgotPassword/' + hashedID + '"</a>http://localhost:3000/forgotPassword/' + hashedID + '</p>'
        };

        await transporter.sendMail(mailOptions, async function (err, info) {
            if (err) {
                _UTILS.errorHandler(err, false, true);
            } else {
                console.log('Email sent: ' + info.response);
                client.set(object.user_email_validation, JSON.stringify(object));
            }
        });
    }

}