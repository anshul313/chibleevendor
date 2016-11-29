#!/usr/bin/env node

/* jslint node: true */
'use strict';
// var util = require('util');

// var subject = process.argv[2];
// var msg = process.argv[3] || '';

// if (!subject) {
// 	console.log('Usage: node-pub <subject> [msg]');
// 	process.exit();
// }
var publish = function(nats, subject, msg) {
	console.log("publish", subject);
	nats.publish(subject, msg, function() {
		console.log('Published [' + subject + '] : "' + msg + '"');
		// console.log(msg);
		// process.exit();
	});
}



var subscribe = function(nats, subject) {
	console.log('Listening on [' + subject + ']');
	nats.subscribe(subject, function(msg) {
		console.log("msg recieved");
		// console.log(JSON.parse(msg));
	});
}

module.exports = {
	publish: publish,
	subscribe: subscribe
}