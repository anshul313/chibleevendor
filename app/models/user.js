var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var vendorSchema = new Schema({
  deviceID: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: Number,
    default: 0
  },
  paytmNumber: {
    type: Number,
    default: 0
  },
  mobikwikNumber: {
    type: Number,
    default: 0
  },
  authToken: {
    type: String,
    default: ''
  },
  model: {
    type: String,
    default: ''
  },
  gcmId: {
    type: String,
    default: ''
  },
  androidSdk: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  isStationary: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  isWalletInterested: {
    type: Boolean,
    default: false
  },
  area: {
    type: String,
    default: ''
  },
  shopNumber: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  landmark: {
    type: String,
    default: ''
  },
  fromTiming: {
    type: String,
    default: ''
  },
  toTiming: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  isHomeDelivery: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: ''
  },
  registerTime: {
    type: Number,
    default: 0
  },
  OTP: {
    type: Number,
    default: 0
  },
  appVersion: {
    type: String,
    default: ''
  },
  speciality: {
    type: String,
    default: ''
  },
  offDays: {
    type: String,
    default: ''
  }
});


module.exports = mongoose.model('vendorDetail', vendorSchema);
