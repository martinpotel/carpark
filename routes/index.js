var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	if (typeof(req.user) !== 'undefined') user = true;
	else user = false;
	res.render('layout', {user: user});
});

module.exports = router;
