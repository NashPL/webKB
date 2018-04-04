let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let webkbSchema = new Schema({
  module_name: String,
  module_url: String,
  module_privilege: String
});

module.exports = mongoose.model('webkbmodule', webkbSchema);
