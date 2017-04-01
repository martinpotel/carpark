var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');



router.post('/save/', function (req, res) {
    var db = req.app.locals.db;
    var parking = req.body.parking;
    parking.user = req.user._id;
    parking.address = req.body.parking.address.components;
    db.collection('parking').save(parking, function(err, doc) {
        res.send('ok');
    });
});

router.get('/all/', function(req,res) {
	var db = req.app.locals.db;
	var parkings = db.collection('parking');	
	parkings.find({}).toArray(function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {
			res.send(result);
		}
	});
});

module.exports = router;