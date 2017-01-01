var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MyPicstore = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  url: {type: String, unique: true},
  title: String
});
module.exports = mongoose.model('MyPicstore', MyPicstore);
