var mongoose = require("mongoose");
var fs = require('fs');
var express = require('express');
var app = express();
var config = require('config');
var autoIncrement = require('mongoose-auto-increment');
var port = process.env.PORT || 8080; // set our port
var session = require('express-session');
var passport = require('passport');

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// var ObjectId = mongoose.Types.ObjectId;

// console.log(ObjectId.isValid("5679366fe1ed4563b5e0ed2a"));

// var natsConnection = require('natsconnect');

// natsConnection.setNats(natsConnection.connect());

// var nats = natsConnection.nats();

// nats.on('error', function(e) {
//  console.log('Error [' + nats.options.url + ']: ' + e);
//  process.exit();
// });

// require('pub-sub').subscribe(nats, 'testing');

// Bootstrap routes
var router = express.Router();
//connect to mongoDb
var connect = function() {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
        // ,
        // user: 'qykly',
        // pass: 'qykly123'
    };
    var connection = mongoose.connect(
        'mongodb://139.59.9.200:12528/chiblee',
        options);;
    autoIncrement.initialize(connection);
    // mongoose.connect('mongodb://localhost/quickly', options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function(file) {
    if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

// Bootstrap application settings
require('./config/express')(app);

//require('./config/amazon')(router, passport);
require('./config/routes')(router);
app.use('/api', router);

//Install application
if (process.env.NODE_ENV != 'test') {
    app.listen(port)
    console.log(process.env.NODE_ENV, 'Quickly API\'s running on the port : ' +
        port);
}
module.exports = app;