/*
 * to run :
 * node upload.js
 * */

/*
 * dependencies
 * */
var express = require('express')
var upload = require('jquery-file-upload-middleware');
var router = express.Router();
var mongo = require('../db/mongodb');

// configuration
var resizeConf = require('./config').resizeVersion;
var dirs = require('./config').directors;
var fs = require("fs");
var path = require("path");
var gm = require('gm').subClass({ imageMagick: true });

//获取当前目录绝对路径，这里resolve()不传入参数
var filePath = 'public/images/location';

// jquery-file-upload helper
router.use('/middle/default', function(req, res, next) {
    upload.fileHandler({
        tmpDir: dirs.temp,
        uploadDir: dirs.default,
        uploadUrl: dirs.default_url,
        imageVersions: resizeConf.default
    })(req, res, next);
});

router.use('/middle/location', function(req, res, next) {
    upload.fileHandler({
        tmpDir: dirs.temp,
        uploadDir: dirs.location,
        uploadUrl: dirs.location_url,
        imageVersions: resizeConf.location
    })(req, res, next);
});

router.use('/middle/location/list', function(req, res, next) {
    upload.fileManager({
        uploadDir: function() {
            return __dirname + dirs.location;
        },
        uploadUrl: function() {
            return dirs.location_url;
        }
    }).getFiles(function(files) {
        res.json(files);
    });
});

// bind event
upload.on('end', function(fileInfo, req, res) {
    // insert file info
    fs.stat(path.join(filePath, fileInfo.name), function(err, stats) {
        if (err) throw err;
        //文件
        // console.log(stats);
        if (stats.isFile()) {
            var image = {
                "title": "",
                "urls": {
                    "url": "",
                    "thumbnailUrl": "",
                    "deleteUrl": "",
                    "smallUrl": "",
                    "mediumUrl": "",
                    "largeUrl": ""
                },
                "CreateTime": "",
                "lastModifiedTime": "",
                "lastAccessTime": "",
                "size": "",
                "kind": "",
                "dimensions": "",
                "colorSpace": "",
                "extension": ""
            };
            image.extension = path.extname(fileInfo.name);
            image.title = path.basename(fileInfo.name, image.extension);
            image.urls.url = fileInfo.url;
            image.urls.thumbnailUrl = fileInfo.thumbnailUrl;
            image.urls.deleteUrl = fileInfo.deleteUrl;
            image.urls.smallUrl = fileInfo.smallUrl;
            image.urls.mediumUrl = fileInfo.mediumUrl;
            image.urls.largeUrl = fileInfo.largeUrl;
            image.size = stats.size;
            gm(path.join(filePath, fileInfo.name))
                .identify(function(err, data) {
                    if (!err) {
                        // console.log(data);
                        image.dimensions = data.size;
                        image.kind = data.Format;
                        image.colorSpace = data.Colorspace;
                        var ct = data.Properties['exif:DateTime'] || data.Properties['exif:DateTimeDigitized'] || data.Properties['exif:DateTimeOriginal'];
                        if (ct != undefined) {
                            var buf = ct.split(' ');
                            var fullyear = buf[0].split(':');
                            var datetime = buf[1].split(':');
                            image.CreateTime = new Date(parseInt(fullyear[0]), parseInt(fullyear[1]) - 1, parseInt(fullyear[2]), (parseInt(datetime[0]) + 8) % 24, parseInt(datetime[0]), parseInt(datetime[0]));
                        } else {
                            image.CreateTime = new Date(data.Properties['date:create']);
                        }
                        // console.dir(req.fields.lastModified);
                        image.lastModifiedTime = new Date(parseInt(req.fields.lastModified));
                        image.lastAccessTime = new Date();
                        mongo.insertMany([image], function(result) {
                            // console.log("%s is file", path.join(filePath, filename));
                        });

                    }
                });
        }
    });
    console.log("files upload complete");
    // console.log(fileInfo);
});

upload.on('delete', function(fileName) {
    // remove file info
    mongo.deleteMany({ title: path.basename(fileName, path.extname(fileName)) }, function(result) {
        // console.log("%s is file", path.join(filePath, filename));
    });
    console.log("files remove complete");
    console.log(fileName);
});

upload.on('error', function(e) {
    console.log(e.message);
});


/*
 * routes
 * */
router.get('/', function(req, res) {
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
        res.render('manage', { title: 'Code & Sudo\'s Land', photos: data });
    })
});

module.exports = router;
