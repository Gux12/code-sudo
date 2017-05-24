var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/index_image', function(req, res, next) {
	console.log(req.query);
    res.send(req.query);
});
module.exports = router;
