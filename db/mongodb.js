var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var DB = require('./DB_CON');

exports.insertMany = function(data, callback) {
    MongoClient.connect(DB.DB_CONN_STR, function(err, db) {
        assert.equal(null, err);
        console.log("连接成功！");
        adminDb = db.admin();
        adminDb.authenticate('guxiang', 'gx199492.', function(err, result) {
            assert.equal(null, err);
            console.log("验证成功！");
            var collection = db.collection(DB.collection);
            collection.insertMany(data, function(err, result) {
                assert.equal(err, null);
                // assert.equal(data.length, result.result.n);
                // assert.equal(data.length, result.ops.length);
                console.log("向" + DB.collection + "插入" + data.length + "个文档");
                console.log(result);
                callback(result);
            });
        });
    });
}

exports.find = function(condition, callback) {
    MongoClient.connect(DB.DB_CONN_STR, function(err, db) {
        assert.equal(null, err);
        console.log("连接成功！");
        adminDb = db.admin();
        adminDb.authenticate('guxiang', 'gx199492.', function(err, result) {
            assert.equal(null, err);
            console.log("验证成功！");
            var collection = db.collection(DB.collection);
            collection.find(condition).toArray(function(err, docs) {
                assert.equal(err, null);
                console.log("找到文档");
                console.log(docs);
                callback(docs);
            });
        });
    });
}

exports.updateMany = function(condition, data, callback) {
    MongoClient.connect(DB.DB_CONN_STR, function(err, db) {
        assert.equal(null, err);
        console.log("连接成功！");
        adminDb = db.admin();
        adminDb.authenticate('guxiang', 'gx199492.', function(err, result) {
            assert.equal(null, err);
            console.log("验证成功！");
            var collection = db.collection(DB.collection);
            collection.updateMany(condition, { $set: data }, function(err, result) {
                assert.equal(err, null);
                console.log("更新成功");
                console.log(result);
                callback(result);
            });
        });
    });
}

exports.deleteMany = function(condition, callback) {
    MongoClient.connect(DB.DB_CONN_STR, function(err, db) {
        assert.equal(null, err);
        console.log("连接成功！");
        adminDb = db.admin();
        adminDb.authenticate('guxiang', 'gx199492.', function(err, result) {
            assert.equal(null, err);
            console.log("验证成功！");
            var collection = db.collection(DB.collection);
            collection.deleteMany(condition, function(err, result) {
                assert.equal(err, null);
                // assert.equal(1, result.result.n);
                console.log("删除成功");
                console.log(result);
                callback(result);
            });
        });
    });
}
