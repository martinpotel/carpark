/**
    Copyright POTEL Martin --- CarParking

     Parking route
*/

var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;



router.post('/save/', function (req, res) {
    var db = req.app.locals.db;
    var parking = req.body.parking;

    if (typeof parking._id !== 'undefined') {
    	parking._id = new ObjectId(parking._id);
    }else{
    	parking.address = req.body.parking.address.components;
    	parking.user = req.user._id;
    }

    parking.dates.start = new Date(parking.dates.start);
    parking.dates.end = new Date(parking.dates.end);

    db.collection('parking').save(parking, function(err, doc) {
        res.send('ok');
    });
});



router.get('/all/', function(req,res) {

	if (typeof req.user === 'undefined') var user=null;
    else user = req.user._id;

	var db = req.app.locals.db;
	var parkings = db.collection('parking');	
	parkings.find({user: {'$ne':user }}).toArray(function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {
			res.send(result);
		}
	});
});

router.post('/by-dates/', function(req,res) {
	if (typeof req.user === 'undefined') var user=null;
    else user = req.user._id;

	var querry = 
	{ '$or': [
		{ 'dates.always': true },
		{ '$and' : [ 
			{'dates.end'   : {'$gte': new Date(req.body.start)}}, 
			{'dates.start' : {'$lte': new Date(req.body.start)}},
			{'dates.end'   : {'$gte': new Date(req.body.end)  }},
			{'dates.start' : {'$lte': new Date(req.body.end)  }}
		]}
	], user: {'$ne':user }};

   	console.log(querry);

	if (typeof req.user === 'undefined') var user=null;
    else user = req.user._id;

	var db = req.app.locals.db;
	var parkings = db.collection('parking');	
	parkings.find(querry).toArray(function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {
			res.send(result);
		}
	});
});

router.get('/get/:id', function(req,res) {
	
	var db = req.app.locals.db;
	var users = db.collection('parking');	
	users.findOne({_id: new ObjectId(req.params.id)}, function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {
			res.send(result);
		}
	});
});


//get the owner of the parking by the parking id
router.get('/owner/:id', function(req,res) {
	
	var db = req.app.locals.db;
	var users = db.collection('users');	
	users.findOne({_id: new ObjectId(req.params.id)}, function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {
			res.send(result);
		}
	});
	
});

//get all the parkings of an user
router.get('/user/:id', function(req, res) {
	var db = req.app.locals.db;
	var parkings = db.collection('parking');
	parkings.find({user:req.params.id}).toArray(function(err, result) {	
		if(result == null) res.send({'error': 'Not found'});
		else {
			res.send(result);
		}
	});
});


router.get('/delete/:id', function(req, res) {
	var db = req.app.locals.db;
	db.collection('booking').find(
		{parking:req.params.id, 'dates.start': { '$gte': new Date() }, '$or': [ {status:'waiting'}, {status:'accepted'}] }).count(function(err, result) {
		if (result <= 0) {
			db.collection('parking').remove({_id: new ObjectId(req.params.id)}, function(err, result) {
				res.send('ok');
			}); 
		}else {
			res.send({'error':'bookings'});
		}
	});
});

module.exports = router;