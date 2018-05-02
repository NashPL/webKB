const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = class _SECURITY {
    static check_user_access(user, modules) {
        let userPrivliges = user['privilege'].split(";");
        let returnModules = [];
        for (let mp of modules) {
            if (mp != undefined) {
                for (let up of userPrivliges) {
                    if (up != undefined) {
                        for (let mps of mp['module_privilege'].split(';')) {
                            if (up == mps) {
                                returnModules.push(mp);
                            }
                        }
                    }
                }
            }
        }
        return returnModules;
    }

    static string_to_bcrypt(str) {
        let salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(str, salt);
    }

    static string_to_sha1(str) {
        let shasum = crypto.createHash('sha1');
        shasum.update(str);
        return shasum.digest('hex');
    }

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