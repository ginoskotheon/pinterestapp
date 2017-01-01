var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Picstore = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  url: String,
  title: String
});
module.exports = mongoose.model('Picstore', Picstore);
