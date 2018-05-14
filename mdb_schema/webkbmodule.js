let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let webkbSchema = new Schema({
    _id: String,
    module_name: String,
    module_url: String,
    module_privilege: Array
});

module.exports = mongoose.model('webkbmodule', webkbSchema);