var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var chatSchema = new Schema({
  vendorID: {
    type: String,
    default: ''
  },
  userID: {
    type: String,
    default: ''
  },
  vendorName: {
    type: String,
    default: ''
  },
  userGcmId: {
    type: String,
    default: ''
  },
  vendorGcmId: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  },
  messageText: {
    type: String,
    default: ''
  },
  messageStatus: {
    type: String,
    default: ''
  },
  uuid: {
    type: String,
    default: ''
  },
  insertionDate: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Chat', chatSchema);
