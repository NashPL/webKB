const redis = require('redis');
const client = redis.createClient(6379, 'localhost');

const db = JSON.parse(fs.readFileSync('./config/configFiles/database.json', 'utf8'));


moduel.export = class _REDIS {

    constructor() {}

    async static new_client() {
        return redis.createClient(db['redis']['port'], db['redis']['url']);
    }

}