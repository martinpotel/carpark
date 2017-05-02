var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;
var async = require('async');

router.post('/create/', function (req, res) {
    var db = req.app.locals.db;
    var booking = req.body.booking;

    booking.tenant = req.user._id;
    booking.accepted = false;
    booking.declined = false;

    db.collection('parking').findOne({_id: new ObjectId(req.body.booking.parking)}, function(err, parking) {
		if(parking == null) res.send({'error': 'Not found'});
		else {
			isAvailable(booking, parking, db, function(err, isAvailable) {
				console.log('available:' + isAvailable);
				if (isAvailable) {
					db.collection('booking').save(booking, function(err, doc) {
	        			res.send('ok');
	   			 	});
				}else{
					res.send({'error':'parking not available'});
				}
				
			});
		}
	});
});

router.get('/accept/:id', function(req, res) {
	var db = req.app.locals.db;

	console.log(req.params.id)
	db.collection('booking').update({_id: new ObjectId(req.params.id)}, {$set: {accepted:true, declined:false}}, function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {		
			console.log('ok')
			res.send('ok');
		}
	});
});

router.get('/decline/:id', function(req, res) {
	var db = req.app.locals.db;

	console.log(req.params.id)
	db.collection('booking').update({_id: new ObjectId(req.params.id)}, {$set: {declined:true, accepted:false}}, function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {		
			console.log('ok')
			res.send('ok');
		}
	});
});



router.get('/not-confirmed/', function (req, res) {
	var db = req.app.locals.db;
	if (typeof req.user === 'undefined') res.send({count:0});
    else {
		db.collection('booking').find({tenant:req.user._id, accepted:false, declined:false}).count(function(err, result) {
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
		db.collection('booking').find({owner:req.user._id, accepted:false, declined:false}).count(function(err, result) {
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
	var bookingRes = [];
	var date = new Date();

	booking.find({tenant:req.params.id}).toArray(function(err, bookings) {	
		if(bookings == null) res.send({'error': 'Not found'});
		else {
			async.forEach(bookings, function(result, cbResult) {
				db.collection('parking').findOne({_id: new ObjectId(result.parking)}, function(err, parking) {
					if(result == null) res.send({'error': 'Not found'});
					else {
						db.collection('users').findOne({_id: new ObjectId(parking.user)}, function(err, owner) {
							if(result == null) res.send({'error': 'Not found'});
							else {
								console.log(result.dates.end);

								if (new Date(result.dates.end)>date) {

									var booking = result;
									booking.parking = parking;
									booking.owner = owner;
									delete booking.owner.admin;
									delete booking.owner.password;
									delete booking.owner.passwordConfirm;
									delete booking.owner.gender;
									delete booking.owner.description;

									bookingRes.push(booking);
								}
								cbResult();	
							}
						});				
					}
				});	
			},function () { res.send(bookingRes) });
		}
	});
});


/* variables make no sense*/
router.get('/owner/:id', function(req, res) {
	var db = req.app.locals.db;
	var booking = db.collection('booking');
	var bookingRes = [];
	var date = new Date();


	booking.find({owner:req.params.id}).toArray(function(err, bookings) {	
		if(bookings == null) res.send({'error': 'Not found'});
		else {
			async.forEach(bookings, function(result, cbResult) {
				
				db.collection('parking').findOne({_id: new ObjectId(result.parking)}, function(err, parking) {
					if(result == null) res.send({'error': 'Not found'});
					else {
						db.collection('users').findOne({_id: new ObjectId(result.tenant)}, function(err, tenant) {
							if(result == null) res.send({'error': 'Not found'});
							else {	
								if (new Date(result.dates.end)>date) {
									var booking = result;
									booking.parking = parking;
									booking.owner = tenant;
									delete booking.owner.admin;
									delete booking.owner.password;
									delete booking.owner.passwordConfirm;
									delete booking.owner.gender;
									delete booking.owner.description;
									bookingRes.push(booking);
								}
								cbResult();	
							}
						});				
					}
				});	
			},function () { res.send(bookingRes) });
		}
	});
});





isAvailable = function (booking, parking, db, cb) {
	
	var available = true;
	db.collection('booking').find({parking:booking.parking}).toArray(function(err, result) {
        async.each(result, function(book, cbResult) {
        	var dateStart = new Date (book.dates.start);
			var dateEnd   = new Date (book.dates.end);

        	if (dateStart >= new Date(booking.dates.start) && new Date(booking.dates.start) <= dateEnd ||
        		dateStart >= new Date(booking.dates.end) && new Date(booking.dates.end) <= dateEnd ) {
        	    	if (!book.declined)	available = false;	
        		
        	}
    
            cbResult(); 
        },function () {
            cb(null,available);
        });  
    });

	/*

	console.log(parking);

	var dateStart = new Date (parking.dates.start);
	var dateEnd   = new Date (parking.dates.end);

	
	console.log(dateStart.getTime());
	console.log(dateEnd.getTime());

	console.log(dateEnd-dateStart);
	
	return true;
	*/

}

module.exports = router;