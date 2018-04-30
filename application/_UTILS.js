const crypto = require('crypto');
const fs = require('fs');

/**
 * A class which handles or utilities of a paltform.
 */
module.exports = class _Utils {
    /**
     * A function which creates a hashed value. If passed argument is undefiend then it creates a value from randomly generated number. Otherwise it hashes the argument
     * @param  {[string]} string An argument which holds a string
     * @return {[string]}        returns a hashed value of either string or a random number based on inputed argument.
     */
    static getHashedValue(string) {
        let sha = crypto.createHash('sha256');
        if (string == undefined) {
            sha.update(Math.random().toString());
            return sha.digest('hex');
        } else {
            sha.update(string);
            return sha.digest('hex');
        }
    }

    /**
     * A function which handles an error, It will either output the error into a server or a log file. It can do both.
     * @param  {[object]} error     An object with error report
     * @param  {[boolean]} logToServer A Boolean value which desides if the error will be logged into a server
     * @param  {[boolean]} logToFile   A Boolean value which desides if the error will be logged into a file
     * @param  {[object]} object      It holds other parameters passed by a function to be logged with a error. ie headers, requests, responses
     * @return {[object]}             Object with status code to see if the logging has been complited
     */
    static errorHanlder(error, logToServer, logToFile, object) {
        let timestamp = Date.now();
        let title = "Error ( " + timestamp + "): ";
        let fileName = timestamp + ".log";
        let stringBuilder = '';
        let returnStatus = {};

        if (logToServer) {
            //TODO: INIT ES HERE AND PUSH IT TO NEW INDEX
        }

        if (logToFile) {
            let isWin = process.platform === "win32";
            if (object) {
                stringBuilder = JSON.stringify(object);
                let errorObject = {};
                errorObject.error = error;
                errorObject.other = stringBuilder;
                stringBuilder = errorObject;
            } else {
                stringBuilder = error;
            }
            stringBuilder = stringBuilder + '\r\n';
            if (isWin) {
                retunStatus = toFile(fileName, stringBuilder, function(response) {
                    console.log(response);
                });
            } else {
                fileName = '/var/log/' + fileName;
                retunStatus = toFile(fileName, stringBuilder, function(response) {
                    console.log(response);
                });
            }
        }
        return returnStatus;
    }

    /**
     * A function which writes a data into a file
     * @param   {[string]} fileName A file location with file name string
     * @param   {[string]} msg      A data to be saved
     * @param   {[object]} callback A callback function
     */
    static toFile(fileName, msg, callback) {
        fs.appendFile(fileName, msg, function(err) {
            let responseObject = {};
            if (err) {
                responseObject.status = 500;
                responseObject.msg = 'Error occured please view ' + fileName;
            } else {
                responseObject.status = 200;
                responseObject.msg = 'Success, file has been created ' + fileName;
            }
            callback(responseObject);
        });
    }
}