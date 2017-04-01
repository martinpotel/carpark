var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

// home
router.get('/users', function(req, res) {
	var db = req.app.locals.db;
	var users = db.collection('users');	
	users.find({}).toArray(function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {
			res.send(result);
		}
	});
});

module.exports = router;
