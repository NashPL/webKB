let fs = require('fs');
let dbObject = JSON.parse(fs.readFileSync('./config/configFiles/database.json', 'utf8'));

exports.getDBObject = function(){
  return dbObject;
}
