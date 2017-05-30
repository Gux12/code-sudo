var express = require('express');
var router = express.Router();
var mongo = require('../db/mongodb');
/* GET home page. */


router.get('/', function(req, res, next) {
    mongo.find({}, function(result) {
        var data = {};
        for (var i = result.length - 1; i >= 0; i--) {
            var image = result[i];
            var lastModifiedTime = new Date(result[i].lastModifiedTime);
            var year = lastModifiedTime.getFullYear().toString();
            var month = (lastModifiedTime.getMonth() + 1).toString();
            var date = lastModifiedTime.getDate().toString();
            // var locateString = lastModifiedTime.getLocateString();
            if (data[year] == undefined) {
                data[year] = {};
                data[year][month] = {};
                data[year][month][date] = [];
                data[year][month][date].push(image);
            } else if (data[year][month] == undefined) {
                data[year][month] = {};
                data[year][month][date] = [];
                data[year][month][date].push(image);
            } else if (data[year][month][date] == undefined) {
                data[year][month][date] = [];
                data[year][month][date].push(image);
            } else {
                data[year][month][date].push(image);
            }
        }
        res.render('index', { title: 'Code & Sudo\'s Land', photos: data });
    })
});
router.get('/index_image_list', function(req, res, next) {
    mongo.find({}, function(result) {
        var data = [];
        for (var i = result.length - 1; i >= 0; i--) {
            var image = result[i];
            data.push(image);
        }
        res.send(data);
    })
});
router.get('/index_image_date_list', function(req, res, next) {
    mongo.find({}, function(result) {
        var data = {};
        for (var i = result.length - 1; i >= 0; i--) {
            var image = result[i];
            var lastModifiedTime = new Date(result[i].lastModifiedTime);
            var year = lastModifiedTime.getFullYear().toString();
            var month = (lastModifiedTime.getMonth() + 1).toString();
            var date = lastModifiedTime.getDate().toString();
            // var locateString = lastModifiedTime.getLocateString();
            if (data[year] == undefined) {
                data[year] = {};
            } else if (data[year][month] == undefined) {
                data[year][month] = {};
            } else if (data[year][month][date] == undefined) {
                data[year][month][date] = [];
                data[year][month][date].push(image);
            } else {
                data[year][month][date].push(image);
            }
        }
        res.send(data);
    });
});
// router.post('/index_image_upload', function(req, res, next) {
//     console.log(req.query);
//     res.send(req.query);
// });
// router.post('/index_image_download', function(req, res, next) {
//     console.log(req.query);
//     res.send(req.query);
// });
module.exports = router;
