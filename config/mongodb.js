const mongoose = require('mongoose');
const dbObject = require('./config');

module.exports = class mongodb {
  constructor(bucket){
    this.bucket = bucket;
  }
  getBucket(){
    return this.bucket;
  }
  connectToBucket(){
    return mongoose.connect('mongodb://' + dbObject.getDBObject()['mongodb']['url'] + '/' + this.bucket);
  }

  connectionInfo(){
    return mongoose.connection;
  }

  mongodbObject(){
    return mongoose;
  }



}
