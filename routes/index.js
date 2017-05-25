var express = require('express');
var router = express.Router();
var mongo = require('../db/mongodb');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/index_image_list', function(req, res, next) {
    mongo.find({}, function(result) {
            var data = [];
            for (var i = result.length - 1; i >= 0; i--) {
                var image = {
                    id: '',
                    url: '',
                    imageWidth: "200",
                    imageHeight: "200"
                };
                image.id = result[i].title;
                image.url = result[i].src;
                data.push(image);
            }
            res.send(data);
        })
        // console.log(req.query);
});
router.get('/index_image', function(req, res, next) {
    console.log(req.query);
    res.send(req.query);
});
router.post('/index_image_upload', function(req, res, next) {
    console.log(req.query);
    res.send(req.query);
});
router.post('/index_image_download', function(req, res, next) {
    console.log(req.query);
    res.send(req.query);
});
module.exports = router;
