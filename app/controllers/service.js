var jwt = require('jsonwebtoken');
var async = require('async');
var config = require('config');
var request = require('request');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var session = require('session');
var async = require('async');
var sns = require('SNS');
var os = require('os');
var fs = require('fs');
var AWS = require('aws-sdk');
var crypto = require('crypto');
var multer = require('multer');
var SNS = require('sns-mobile');
// var v2payload = require("v2payload");
var vendor = mongoose.model('vendorDetail');
var vendorlocation = mongoose.model('Location');
var gcm = require('node-gcm');
var accessKey = 'AKIAIAIBZ2HSPX3L35DA';
var secretKey = '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';
var chat = mongoose.model('Chat');
var MongoClient = require('mongodb').MongoClient;



// config.amazon.accessKeyId = "AKIAJPFKQ6DYJVOHFFKA";
// config.amazon.secretAccessKey = "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";
// config.amazon.region = "ap-southeast-1";

var response = {
  error: false,
  status: 200,
  userMessage: '',
  errors: null,
  data: null,
};

var NullResponseValue = function() {
  response = {
    error: false,
    status: 200,
    userMessage: '',
    errors: null,
    data: null,
  };
  return true;
};

var SendResponse = function(res) {
  res.status(response.status);
  res.send(response);
  NullResponseValue();
};

/*===========================================
***   Services  ***
=============================================*/

var methods = {};

module.exports.controller = function(router) {

  router
    .route('/launch')
    .post(methods.launch);

  router
    .route('/login')
    .post(methods.generateOTP)
    .put(methods.confirmOTP);

  router
    .route('/locationhistory')
    .post(methods.locationHistory)

  router
    .route('/vendortouserchat')
    .post(methods.vendortouserchat);

  router
    .route('/usertovendorchat')
    .post(methods.usertovendorchat);



}

/*===========================================
***  End Services  ***
=============================================*/

/*===========================================
* * * launch * * *
=============================================*/

methods.launch = function(req, res) {
    console.log(req.files);
    var bucket_name = 'chiblee';
    var filename = "";
    var image_url = 'https://s3-ap-southeast-1.amazonaws.com/chiblee/' +
      filename;
    var storage = multer.diskStorage({
      destination: function(req, file, callback) {
        callback(null, "./")
      },
      filename: function(req, file, callback) {
        console.log("file", file.originalname)
        filename = new Date().getTime() + ".png"
        callback(null, filename)
      }
    });
    var uploadfile = multer({
      storage: storage,
      size: 1080 * 10 * 10 * 10
    }).single('file');
    uploadfile(req, res, function(err) {
      if (err) {
        response.error = true;
        response.status = 400;
        response.errors = err;
        response.userMessage = "Server internal error";
        return SendResponse(res);
      } else {
        if (filename == "") {
          vendor.findOne({
            mobileNumber: req.body.mobileNumber
          }, function(err, data) {
            if (err) {
              response.error = true;
              response.status = 400;
              response.errors = err;
              response.userMessage = "Server internal error";
              return SendResponse(res);
            } else if (data) {
              var OTP = String(Math.floor(Math.random() * (9999 - 1000 +
                1) + 1000));
              vendor.update({
                  mobileNumber: req.body.mobileNumber
                }, {
                  "$set": {
                    deviceID: req.body.deviceID,
                    email: req.body.email,
                    model: req.body.model,
                    mobileNumber: req.body.mobileNumber,
                    appVersion: req.body.appVersion,
                    paytmNumber: req.body.paytmNumber,
                    mobikwikNumber: req.body.mobikwikNumber,
                    gcmId: req.body.gcmId,
                    androidSdk: req.body.androidSdk,
                    category: req.body.category,
                    isStationary: req.body.isStationary,
                    isMobile: req.body.isStationary,
                    isWalletInterested: req.body.isWalletInterested,
                    area: req.body.area,
                    shopNumber: req.body.shopNumber,
                    address: req.body.address,
                    landmark: req.body.landmark,
                    fromTiming: req.body.fromTiming,
                    toTiming: req.body.toTiming,
                    name: req.body.name,
                    isHomeDelivery: req.body.isHomeDelivery,
                    registerTime: new Date().getTime(),
                    imageUrl: '',
                    OTP: parseInt(OTP),
                    speciality: req.body.speciality,
                    offDays: req.body.offDays
                  }
                }, {
                  multi: true
                },
                function(err, result) {
                  if (err) {
                    response.error = true;
                    response.status = 400;
                    response.errors = err;
                    response.userMessage = "Server internal error";
                    return SendResponse(res);
                  } else {
                    console.log("You are old User");
                    response.error = false;
                    response.status = 200;
                    response.userMessage =
                      "Vendor already exists";
                    response.data = {
                      otp: parseInt(OTP),
                      isActive: data.isActive,
                      vendorId: data._id
                    };
                    return SendResponse(res);
                  }
                });
            } else {

              var OTP = String(Math.floor(Math.random() * (9999 - 1000 +
                1) + 1000));
              var authtoken = crypto.createHmac('sha256', req.body.deviceID)
                .update(req.body.email).digest('hex');
              var vendorDetail = new vendor({
                deviceID: req.body.deviceID,
                email: req.body.email,
                model: req.body.model,
                authToken: authtoken,
                mobileNumber: req.body.mobileNumber,
                appVersion: req.body.appVersion,
                paytmNumber: req.body.paytmNumber,
                mobikwikNumber: req.body.mobikwikNumber,
                gcmId: req.body.gcmId,
                androidSdk: req.body.androidSdk,
                category: req.body.category,
                isStationary: req.body.isStationary,
                isMobile: req.body.isStationary,
                isWalletInterested: req.body.isWalletInterested,
                area: req.body.area,
                shopNumber: req.body.shopNumber,
                address: req.body.address,
                landmark: req.body.landmark,
                fromTiming: req.body.fromTiming,
                toTiming: req.body.toTiming,
                name: req.body.name,
                isHomeDelivery: req.body.isHomeDelivery,
                registerTime: new Date().getTime(),
                imageUrl: '',
                OTP: OTP,
                speciality: req.body.speciality,
                offDays: req.body.offDays,
                isActive: false
                  // ARN: endpointArn
              });
              vendorDetail.save(function(err, data) {
                if (err) {
                  response.error = true;
                  response.errors = err;
                  response.status = 500;
                  response.userMessage = "Server internal error";
                  return SendResponse(res);
                } else {
                  console.log("You are new User");
                  response.userMessage =
                    "Vendor registred successfuly";
                  response.status = 200;
                  response.data = {
                    otp: vendorDetail.OTP,
                    isActive: vendorDetail.isActive,
                    vendorId: data._id
                  };
                  return SendResponse(res);
                }
              });
            }
          });
        } else {
          var readStream = fs.createReadStream('./' +
            filename);

          s3Upload(readStream, filename, req, res);

          vendor.findOne({
            mobileNumber: req.body.mobileNumber
          }, function(err, data) {
            if (err) {
              response.error = true;
              response.status = 400;
              response.errors = err;
              response.userMessage = "Server internal error";
              return SendResponse(res);
            } else if (data) {
              var OTP = String(Math.floor(Math.random() * (9999 - 1000 +
                1) + 1000));
              vendor.update({
                  mobileNumber: req.body.mobileNumber
                }, {
                  "$set": {
                    deviceID: req.body.deviceID,
                    email: req.body.email,
                    model: req.body.model,
                    mobileNumber: req.body.mobileNumber,
                    appVersion: req.body.appVersion,
                    paytmNumber: req.body.paytmNumber,
                    mobikwikNumber: req.body.mobikwikNumber,
                    gcmId: req.body.gcmId,
                    androidSdk: req.body.androidSdk,
                    category: req.body.category,
                    isStationary: req.body.isStationary,
                    isMobile: req.body.isStationary,
                    isWalletInterested: req.body.isWalletInterested,
                    area: req.body.area,
                    shopNumber: req.body.shopNumber,
                    address: req.body.address,
                    landmark: req.body.landmark,
                    fromTiming: req.body.fromTiming,
                    toTiming: req.body.toTiming,
                    name: req.body.name,
                    isHomeDelivery: req.body.isHomeDelivery,
                    registerTime: new Date().getTime(),
                    imageUrl: image_url,
                    OTP: parseInt(OTP),
                    speciality: req.body.speciality,
                    offDays: req.body.offDays
                  }
                }, {
                  multi: true
                },
                function(err, result) {
                  if (err) {
                    response.error = true;
                    response.status = 400;
                    response.errors = err;
                    response.userMessage = "Server internal error";
                    return SendResponse(res);
                  } else {
                    console.log("You are old User");
                    response.error = false;
                    response.status = 200;
                    response.userMessage =
                      "Vendor already exists";
                    response.data = {
                      isActive: data.isActive,
                      vendorId: data._id
                    };
                    return SendResponse(res);
                  }
                });
            } else {

              var OTP = String(Math.floor(Math.random() * (9999 - 1000 +
                1) + 1000));
              var authtoken = crypto.createHmac('sha256', req.body.deviceID)
                .update(req.body.email).digest('hex');
              var vendorDetail = new vendor({
                deviceID: req.body.deviceID,
                email: req.body.email,
                model: req.body.model,
                authToken: authtoken,
                mobileNumber: req.body.mobileNumber,
                appVersion: req.body.appVersion,
                paytmNumber: req.body.paytmNumber,
                mobikwikNumber: req.body.mobikwikNumber,
                gcmId: req.body.gcmId,
                androidSdk: req.body.androidSdk,
                category: req.body.category,
                isStationary: req.body.isStationary,
                isMobile: req.body.isStationary,
                isWalletInterested: req.body.isWalletInterested,
                area: req.body.area,
                shopNumber: req.body.shopNumber,
                address: req.body.address,
                landmark: req.body.landmark,
                fromTiming: req.body.fromTiming,
                toTiming: req.body.toTiming,
                name: req.body.name,
                isHomeDelivery: req.body.isHomeDelivery,
                registerTime: new Date().getTime(),
                imageUrl: image_url,
                OTP: OTP,
                speciality: req.body.speciality,
                offDays: req.body.offDays,
                isActive: false
                  // ARN: endpointArn
              });
              vendorDetail.save(function(err, data) {
                if (err) {
                  response.error = true;
                  response.errors = err;
                  response.status = 500;
                  response.userMessage = "Server internal error";
                  return SendResponse(res);
                } else {
                  response.userMessage =
                    "Vendor registred successfuly";
                  response.status = 200;
                  response.data = {
                    otp: vendorDetail.OTP,
                    isActive: vendorDetail.isActive,
                    vendorId: data._id
                  };
                  return SendResponse(res);
                }
              });
            }
          });
        }
      }
    });
  }
  /*-----  End of launch  --------*/


var s3Upload = function(readStream, fileName, req, res) {
  var bucket_name = 'chiblee';
  var s3 = new AWS.S3({
    region: 'ap-southeast-1',
    apiVersion: '2010-03-31',
    accessKeyId: accessKey,
    secretAccessKey: secretKey
  });
  var params = {
    Bucket: bucket_name,
    Key: fileName,
    ACL: 'public-read',
    Body: readStream
  };
  s3.putObject(params, function(err, data) {
    if (err) {
      response.error = true;
      response.errors = err;
      response.status = 500;
      response.userMessage = "Server internal error";
    } else {
      var filePath = './' + fileName;
      fs.unlinkSync(filePath);
    }
  });
};

/*===========================================
***   genrating OTP   ***
=============================================*/

methods.generateOTP = function(req, res) {
  var OTP = String(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000));
  console.log(OTP);
  // var options = {
  //   method: 'GET',
  //   uri: 'http://luna.a2wi.co.in:7501/failsafe/HttpLink',
  //   qs: {
  //     aid: 630972,
  //     pin: "lou@1",
  //     mnumber: "91" + req.body.mobileNumber,
  //     message: "Thanks for downloading qykly. Your one time password is " +
  //       OTP,
  //     signature: "LSHOUT"
  //   }
  // };
  device.findOne({
    deviceID: req.body.deviceID
  }, function(err, data) {
    if (err) {
      response.error = true;
      response.errors = err;
      response.status = 500;
      response.userMessage = "Server internal error";
      return SendResponse(res);
    } else if (!data) {
      response.error = true;
      response.errors = err;
      response.status = 400;
      response.userMessage = "Device not found";
      return SendResponse(res);
    } else {
      if ((req.body.mobile).length != 10) {
        console.log("mobile Invalid");
        response.error = true;
        response.status = 400;
        response.userMessage = "Invalid mobileNumber";
        return SendResponse(res);
      } else {
        deviceID = data.deviceID;
        deviceID.findOne({
          mobileNumber: req.body.mobileNumber
        }, function(err, data) {
          if (err) {
            response.error = true;
            response.errors = err;
            response.status = 500;
            response.userMessage = "Server internal error";
            return SendResponse(res);
          } else if (data) {
            console.log("mobile number already exist");
            // request('http://luna.a2wi.co.in:7501/failsafe/HttpLink',
            //   options,
            //   function(err, resp, body) {
            //     if (err || resp.statusCode != 200) {
            //       response.error = true;
            //       response.errors = err;
            //       response.status = 500;
            //       response.userMessage = "Server internal error";
            //       return SendResponse(res);;
            //     } else {
            data.OTP = OTP;
            data.mobileNumber = req.body.mobile;
            data.otpTime = Date.now().getTime();
            data.save(function(err, result) {
              if (err) {
                response.error = true;
                response.errors = err;
                response.status = 500;
                response.userMessage =
                  "Server internal error";
                return SendResponse(res);
              } else {
                response.userMessage = "OTP sent";
                response.status = 200;
                response.data = OTP;

                return SendResponse(res);
              }
            });
            //   }
            // });
          } else {
            // request('http://luna.a2wi.co.in:7501/failsafe/HttpLink',
            //   options,
            //   function(error, resp, body) {
            //     console.log("mobile number not exist");
            //     if (!error && resp.statusCode == 200) {
            var newUser = new user({
              mobileNumber: req.body.mobile,
              OTP: OTP
            });
            newUser.save(function(err) {
              if (err) {
                response.error = true;
                response.errors = err;
                response.status = 500;
                response.userMessage =
                  "Server internal error";
                return SendResponse(res);
              } else {
                response.userMessage = "OTP sent";
                response.status = 200;
                response.data = OTP;
                return SendResponse(res);
              }
            });
            //   } else {
            //     response.error = true;
            //     response.status = 500;
            //     response.errors = err;
            //     response.userMessage = "Server internal error";
            //     return SendResponse(res);
            //   }
            // });
          }
        });
      }
    }
  });
}

/*-----  End of generateOTP --------*/

/*===========================================
***   user confirmation using OTP   ***
=============================================*/

methods.confirmOTP = function(req, res) {
  // req.checkBody('mobileNumber', 'mobile is required.').notEmpty();
  // req.checkBody('otp', 'otp is required.').notEmpty();
  var errors = req.validationErrors(true);
  if (errors) {
    response.error = true;
    response.status = 400;
    response.errors = errors;
    response.userMessage = 'Validation errors';
    return (SendResponse(res));
  } else {
    userData = req.body;
    vendor.findOne({
      OTP: userData.otp
    }, function(err, data) {
      if (err) {
        response.error = true;
        response.status = 500;
        response.errors = err;
        response.userMessage = "sever error";
        return SendResponse(res);
      } else if (!data) {
        response.error = true;
        response.status = 400;
        response.errors = err;
        response.userMessage = "OTP invalid";
        return SendResponse(res);
      } else {
        //   var otpTime = data.otpTime
        //   var currentTime = Date.now()
        //   if ((currentTime - otpTime) < 900e3) {
        //     data.created = Date.now()
        //     data.signupComplete = true
        //     var token = jwt.sign({
        //       userID: String(data._id)
        //     }, config.sessionSecret, {
        //       expiresIn: 60 * 60 * 120
        //     });
        //     data.authToken = token
        //     if (data.deviceID.indexOf(req.body.deviceID) < 0) {
        //       data.deviceID.push(req.body.deviceID);
        //     }
        //     data.currentDevice = data.deviceID.indexOf(req.body.deviceID)
        //     data.save(function(err) {
        //       if (err) {
        //         response.error = true;
        //         response.status = 500;
        //         response.errors = err;
        //         response.userMessage = "Server error";
        //         return SendResponse(res);
        //       } else {
        response.error = false;
        response.status = 200;
        response.data = data
        response.errors = err;
        response.userMessage = "Thanks for Login";
        return SendResponse(res);
      }
      //     });
      //   } else {
      //   response.error = true;
      //   response.status = 400;
      //   response.errors = err;
      //   response.userMessage = "OTP expired";
      //   return SendResponse(res);
      // }
      // }
    });
  }
}

/*-----  End of confirmOTP   --------*/

/*===========================================
***   user location history manage   ***
=============================================*/

methods.locationHistory = function(req, res) {
  var opentime = 0;
  var closetime = 0;
  if (parseInt(req.body.isOpen) == 0) {
    closetime = new Date().getTime()
  }
  if (parseInt(req.body.isOpen) == 1) {
    opentime = new Date().getTime()
  }

  if (parseInt(req.body.isOpen) != -1) {
    var newvendorlocation = new vendorlocation({
      vendorID: req.body.vendorID,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      registerTime: new Date().getTime(),
      isOpen: req.body.isOpen,
      openTime: opentime,
      closeTime: closetime
    });
    newvendorlocation.save(function(err) {
      if (err) {
        response.error = true;
        response.errors = err;
        response.status = 500;
        response.userMessage =
          "Server internal error";
        return SendResponse(res);
      } else {
        response.userMessage = "location inserted successfuly";
        response.status = 200;
        return SendResponse(res);
      }
    });
  }
}

/*-----  End of locationHistory   --------*/

/*===========================================
***  vendortouserchat Notification  Trigger Service   ***
=============================================*/

methods.vendortouserchat = function(req, res) {

  var message = new gcm.Message();
  var sender = new gcm.Sender('AIzaSyB4P3z-0xUTn3vIVpfvEuuI3er4UCzPUM0');

  message.addNotification({
    "messageText": req.body.messageText,
    "messageStatus": req.body.messageStatus
  });

  sender.send(message, {
    registrationTokens: [req.body.userGcmId]
  }, function(err, result) {
    if (err) {
      console.log(err);
      response.error = true;
      response.status = 500;
      response.errors = err;
      response.userMessage = 'error occured';
      return (SendResponse(res));
    } else {
      if (result.success == 1) {
        MongoClient.connect('mongodb://54.169.192.5:12528/chiblee',
          function(err, db) {
            db.collection('chibleeusers').findOne({
              pushToken: req.body.userGcmId
            }, function(err, doc) {
              if (err) {
                console.log(err);
                response.error = true;
                response.status = 500;
                response.errors = err;
                response.userMessage = 'error occured';
                return (SendResponse(res));
              } else {
                var chatMessage = new chat({
                  vendorID: req.body.vendorId,
                  userID: doc._id,
                  messageText: req.body.messageText,
                  messageStatus: req.body.messageStatus,
                  registerTime: new Date().getTime(),
                  userName: req.body.userName,
                  vendorName: req.body.vendorName
                });
                chatMessage.save(function(err) {
                  if (err) {
                    console.log(err);
                    response.error = true;
                    response.status = 500;
                    response.errors = err;
                    response.userMessage = 'error occured';
                    return (SendResponse(res));
                  }
                  console.log(response);
                  response.error = false;
                  response.status = 200;
                  response.userMessage = 'successfully sent';
                  response.data = {
                    vendorId: req.body.vendorId;
                    vendorName: req.body.vendorName;
                    userName: req.body.userName;
                    vendorGcmId: req.body.vendorGcmId;
                    messageText: req.body.messageText;
                    messageStatus: req.body.messageStatus;
                    platform: req.body.platform;
                    userGcmId: req.body.userGcmId;
                  };

                  db.close();
                  return (SendResponse(res));
                });
              }
            });
          });
      } else {
        response.error = true;
        response.status = 500;
        response.errors = result.results[0].error;
        response.userMessage = 'error occured';
        return (SendResponse(res));
      }

    }
  });
}

/*-----  End of vendortouserchat Notification Trigger Service  --------*/

/*===========================================
***  usertovendorchat Notification  Trigger Service   ***
=============================================*/

methods.usertovendorchat = function(req, res) {

  var message = new gcm.Message();

  var sender = new gcm.Sender('AIzaSyCpG_J5buAuWMM1p3f6geFVlCPJ5139o2Q');

  message.addNotification({
    "messageText": req.body.messageText,
    "messageStatus": req.body.messageStatus
  });

  sender.send(message, {
    registrationTokens: [req.body.vendorGcmId]
  }, function(err, result) {
    if (err) {
      console.log(err);
      response.error = true;
      response.status = 500;
      response.errors = err;
      response.userMessage = 'error occured';
      return (SendResponse(res));
    } else {
      if (result.success == 1) {
        MongoClient.connect('mongodb://54.169.192.5:12528/chiblee',
          function(err, db) {
            db.collection('cleanvendors').findOne({
              gcmId: req.body.userGcmId
            }, function(err, doc) {
              if (err) {
                console.log(err);
                response.error = true;
                response.status = 500;
                response.errors = err;
                response.userMessage = 'error occured';
                return (SendResponse(res));
              } else {

                var chatMessage = new chat({
                  vendorID: req.body.vendorId,
                  userID: doc._id,
                  messageText: req.body.messageText,
                  messageStatus: req.body.messageStatus,
                  registerTime: new Date().getTime(),
                  userName: req.body.userName,
                  vendorName: req.body.vendorName
                });
                chatMessage.save(function(err) {
                  if (err) {
                    console.log(err);
                    response.error = true;
                    response.status = 500;
                    response.errors = err;
                    response.userMessage = 'error occured';
                    return (SendResponse(res));
                  }
                  console.log(response);
                  response.error = false;
                  response.status = 200;
                  response.userMessage = 'successfully sent';
                  response.data = {
                    vendorId: req.body.vendorId;
                    vendorName: req.body.vendorName;
                    userName: req.body.userName;
                    vendorGcmId: req.body.vendorGcmId;
                    messageText: req.body.messageText;
                    messageStatus: req.body.messageStatus;
                    platform: req.body.platform;
                    userGcmId: req.body.userGcmId;
                  };
                  db.close();
                  return (SendResponse(res));
                });
              }
            });
          });
      } else {
        response.error = true;
        response.status = 500;
        response.errors = result.results[0].error;
        response.userMessage = 'error occured';
        return (SendResponse(res));
      }
    }
  });
}

/*-----  End of usertovendorchat Notification Trigger Service  --------*/
