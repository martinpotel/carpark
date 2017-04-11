var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;



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
	db.collection('parking').remove({_id: new ObjectId(req.params.id)}, function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {		
			res.send(result);
		}
	});
});

module.exports = router;