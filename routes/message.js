var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;
var mailService = require('../helpers/mail');

router.post('/send/', function (req, res) {
    var db = req.app.locals.db;
    var message = req.body.message;
    message.from = req.user._id;
    message.fromString = req.user.firstname + ' ' + req.user.lastname;
    message.read = false;
    console.log(message);

    db.collection('message').save(message, function(err, doc) {
    	db.collection('users').findOne({_id: new ObjectId(message.to)}, function(err, user) {
			mailService.prepareMail(user.mail, 'message', db, function() {
				res.send('ok');
			});
		});    
    });
});

router.post('/mark-as-read/', function (req, res) {
    var db = req.app.locals.db;
    var message = req.body.message;
    message.read = true;
	
	message._id = new ObjectId(message._id);
    db.collection('message').save(message, function (err, doc) {
        res.send('ok');        
    });
});

router.get('/not-read/', function (req, res) {
	var db = req.app.locals.db;
	if (typeof req.user === 'undefined') res.send({count:0});
    else {
		db.collection('message').find({to:req.user._id, read:false}).count(function(err, result) {
			if(result == null) res.send({'error': 'Not found'});
			else {
				res.send({count:result});
			}
		});
	}
});


router.get('/all/', function(req,res) {
	var db = req.app.locals.db;

	db.collection('message').find({to:req.user._id}).toArray(function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {
			res.send(result);
		}
	});
});

router.get('/delete/:id', function(req, res) {
	var db = req.app.locals.db;
	db.collection('message').remove({_id: new ObjectId(req.params.id)}, function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {		
			res.send(result);
		}
	});
});


module.exports = router;