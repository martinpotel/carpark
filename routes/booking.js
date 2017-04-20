var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;

router.post('/create/', function (req, res) {
    var db = req.app.locals.db;
    var booking = req.body.booking;

    booking.tenant = req.user._id;
    booking.accepted = false;

    console.log(booking);

    db.collection('parking').findOne({_id: new ObjectId(req.body.booking.parking)}, function(err, parking) {
		if(parking == null) res.send({'error': 'Not found'});
		else {
			if (isAvailable(booking, parking)){
				db.collection('booking').save(booking, function(err, doc) {
	        		res.send('ok');
	   			 });
			}
			else {
				res.send({'error':'Not Available'});
			}
		}
	});
});



router.get('/not-confirmed/', function (req, res) {
	var db = req.app.locals.db;
	if (typeof req.user === 'undefined') res.send({count:0});
    else {
		db.collection('booking').find({tenant:req.user._id, accepted:false}).count(function(err, result) {
			if(result == null) res.send({'error': 'Not found'});
			else {
				res.send({count:result});
			}
		});
	}
});

router.get('/to-confirm/', function (req, res) {
	var db = req.app.locals.db;
	if (typeof req.user === 'undefined') res.send({count:0});
    else {
		db.collection('booking').find({owner:req.user._id, accepted:false}).count(function(err, result) {
			if(result == null) res.send({'error': 'Not found'});
			else {
				res.send({count:result});
			}
		});
	}
});


router.get('/user/:id', function(req, res) {
	var db = req.app.locals.db;
	var booking = db.collection('booking');
	booking.find({tenant:req.params.id}).toArray(function(err, result) {	
		if(result == null) res.send({'error': 'Not found'});
		else {
			res.send(result);
		}
	});
});



// TODO
isAvailable = function (booking, parking) {
	/*
	var dateStart = new Date (parking.dates.start);
	var dateEnd   = new Date (parking.dates.end);

	
	console.log(dateStart.getTime());
	console.log(dateEnd.getTime());

	console.log(dateEnd-dateStart);
	
	*/
	return true;

}

module.exports = router;