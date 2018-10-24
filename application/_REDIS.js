const redis = require('redis');
const client = redis.createClient(6379, 'localhost');
const fs = require('fs');

const db = JSON.parse(fs.readFileSync('./config/configFiles/database.json', 'utf8'));


module.exports = class _REDIS {

    constructor() {}

    static new_client() {
        return redis.createClient(db['redis']['port'], db['redis']['url']);
    }

}