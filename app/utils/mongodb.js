var MongoClient = require('mongodb').MongoClient;
var config = require('config');

// console.log('config');
// console.log(config);
console.log("you are in mongodb.js");
// MongoClient.connect('mongodb://47.88.193.23:12528/qykly', function(err, db) {
//     console.log(err);
//     db.collection('user').find({}).toArray(function(err, docs) {
//         console.log(err);
//         console.log(docs);
//     });
// });

module.exports = {
    distinct: function(collection, query, cb) {
        if (!query) query = {};


        MongoClient.connect('mongodb://47.88.193.23:12528/qykly', function(err, db) {
            // MongoClient.connect("mongodb://" + config.mongo.host + ':' + config.mongo.port + "/" + config.mongo.db + "?maxPoolSize=1", function(err, db) {

            // db.authenticate('', '', function(auth_err, auth_res) {
            // db.authenticate(config.mongo.username, config.mongo.password, function(auth_err, auth_res) {
            if (!err) {
                db.collection(collection).distinct(query, function(error, docs) {
                    db.close();
                    if (error) return cb(error, null);
                    return cb(null, docs);
                });
            } else {
                console.log(auth_err);
                console.log(auth_res);
            }
            // });
        });
    },

    find: function(collection, query, cb) {
        if (!query) query = {};

        MongoClient.connect('mongodb://47.88.193.23:12528/qykly', function(err, db) {
            // MongoClient.connect("mongodb://" + config.mongo.host + ':' + config.mongo.port + "/" + config.mongo.db + "?maxPoolSize=1", function(err, db) {

            // db.authenticate('', '', function(auth_err, auth_res) {
            // db.authenticate(config.mongo.username, config.mongo.password, function(auth_err, auth_res) {
            if (!err) {
                db.collection(collection).find(query).toArray(function(error, docs) {
                    db.close();
                    if (error) return cb(error, null);
                    return cb(null, docs);
                });
            } else {
                console.log(auth_err);
                console.log(auth_res);
            }
            // });
        });
    },

    insert: function(collection, query, cb) {
        if (!query) query = {};

        MongoClient.connect('mongodb://47.88.193.23:12528/qykly', function(err, db) {

            // MongoClient.connect("mongodb://" + config.mongo.host + ':' + config.mongo.port + "/" + config.mongo.db + "?maxPoolSize=1", function(err, db) {

            query['createdAt'] = new Date();
            query['updatedAt'] = new Date();

            // db.authenticate('', '', function(auth_err, auth_res) {
            // db.authenticate(config.mongo.username, config.mongo.password, function(auth_err, auth_res) {
            if (!err) {
                db.collection(collection).insert(query, function(err) {
                    db.close();
                    if (err) return cb(err);
                    return cb(null);
                });
            } else {
                console.log(auth_err);
                console.log(auth_res);
            }
            // });
        });
    },

    update: function(collection, query1, query2, upsert, cb) {
        if (!query1) query1 = {};
        if (!query2) query2 = {};


        query2['updatedAt'] = new Date();
        MongoClient.connect('mongodb://47.88.193.23:12528/qykly', function(err, db) {
            // MongoClient.connect("mongodb://" + config.mongo.host + ':' + config.mongo.port + "/" + config.mongo.db + "?maxPoolSize=1", function(err, db) {
            // db.authenticate('', '', function(auth_err, auth_res) {
            // db.authenticate(config.mongo.username, config.mongo.password, function(auth_err, auth_res) {
            if (!err) {
                if (upsert)
                    db.collection(collection).update(query1, query2, {
                        '$upsert': true
                    }, function(error) {
                        db.close();
                        if (error) return cb(error);
                        return cb(null);
                    });
                else
                    db.collection(collection).update(query1, query2, function(error) {
                        db.close();
                        if (error) return cb(error);
                        return cb(null);
                    });
            } else {
                console.log(auth_err);
                console.log(auth_res);
            }
            // });
        });
    },

    aggregate: function(collection, aggArr, cb) {
        if (!aggArr) return cb({
            'err': 'Not aggregation pipeline query passed.'
        });

        MongoClient.connect('mongodb://47.88.193.23:12528/qykly', function(err, db) {
            // MongoClient.connect("mongodb://" + config.mongo.host + ':' + config.mongo.port + "/" + config.mongo.db + "?maxPoolSize=1", function(err, db) {

            // db.authenticate('', '', function(auth_err, auth_res) {
            // db.authenticate(config.mongo.username, config.mongo.password, function(auth_err, auth_res) {
            if (!err) {
                db.collection(collection).aggregate(aggArr, function(error, docs) {
                    db.close();
                    if (error) return cb(error, null);
                    return cb(null, docs);
                });
            } else {
                console.log(auth_err);
                console.log(auth_res);
            }
            // });
        });
    }
}