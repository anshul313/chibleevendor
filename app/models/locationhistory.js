var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var locationSchema = new Schema({
  vendorID: {
    type: String,
    default: ''
  },
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  registerTime: {
    type: Number,
    default: 0
  },
  isOpen: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Location', locationSchema);
