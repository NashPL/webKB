const crypto = require('crypto');

const mongoose = require('mongoose');
const webkbmodule = require('./../mdb_schema/webkbmodule');
const _UTILS = require('./_UTILS');

module.exports = class _SECURITY {
    /**
     * Checks what modules user have access.
     * It loops through the permission array and returns allowed modules infromation.
     * @param  {[object]} user  Holds user object
     * @return {[object]}       Returns list of objects which user can access
     */
    static async check_user_access_all_modules(user) {
        try {
            let modules = await webkbmodule.find({});
            let returnModules = {};
            for (let module of modules) {
                for (let usr_per of user.user_permission) {
                    if (module.module_privilege.includes(';')) {
                        let moduleArray = module.module_privilege.split(';');
                        for (let singleModulePer of moduleArray) {
                            if (singleModulePer === usr_per) {
                                returnModules[module.module_name] = module;
                            }
                        }
                    } else {
                        if (module.module_privilege === usr_per) {
                            returnModules[module.module_name] = module;
                        }
                    }
                }
            }
            return returnModules;
        } catch (err) {
            _UTILS.errorHandler(err, false, true);
        }
    }

    /**
     * Create SHA1 hash of a given string
     * @param  {[string]} str holds a string to be hashed
     * @return {[string]}     returns hashed string
     */
    static string_to_sha1(str) {
        let shasum = crypto.createHash('sha1');
        shasum.update(str);
        return shasum.digest('hex');
    }

    /**
     * Check if user object have admin permission
     * @param  {[object]}  user_session Holds a user object with information about user. Information are beeing passed from session but the object can be plain if needed
     * @return {Boolean}              Returns true if user is a admin or false if it is not
     */
    static is_admin(user_session) {
        if (typeof user_session.username === 'undefined' || user_session.username === null) return false;
        if (typeof user_session.privilege === 'undefined' || user_session.privilege === null) return false;

        let userName = user_session.username;
        let privilege = user_session.privilege;

        privilege = privilege.split(";");

        //Check one if user  == CREATOR KBuczynski
        if (userName === 'kbuczynski') {
            return true;
        }

        //Chec for admin privilege
        for (let singPriv of privilege) {
            if (singPriv === "ADMIN") {
                return true;
            }
        }

        return false;
    }
}