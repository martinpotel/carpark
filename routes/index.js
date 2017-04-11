var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var admin = false;

	if (typeof(req.user) !== 'undefined') {
		user = true;
		if (req.user.admin) admin = true;
	}
	else user = false;
	res.render('layout', {user: user, admin:admin, userInfos:req.user});
});

module.exports = router;
