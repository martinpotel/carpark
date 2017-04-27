var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;
var async = require('async');

router.get('/ages', function(req,res) {
	var db = req.app.locals.db;

    getUsersAges(db, function(err, values) {
        getLablesAges(function(err, labels) {
        	count(db, function(err, nb) {
        		console.log(nb);
        		res.send({labels:labels, values:values, count:nb});
        	}); 
        })      
    });  
});

router.get('/parkings', function(req, res) {
	var db = req.app.locals.db;
    getParkingTypes(db, function(err, types) {
        getParkingSize(db, function(err, sizes) {
            res.send({sizes:sizes, types:types});
        });
    });
	
});


router.get('/bookings', function(req,res) {
    var count = 0;
    var labels = ['1', '1-5', '5-10', '10-15', '>15'];
    var values = [0,0,0,0,0];


    var db = req.app.locals.db;
    db.collection('booking').find({}).toArray(function(err, result) {
        async.each(result, function(book, cbResult) {

            var diff = dateDiff(new Date(book.dates.start),new Date(book.dates.end));
            if (diff === 0) values[0]++
            if (diff >= 1  && diff <= 5) values[1]++
            if (diff > 5  && diff <= 10) values[2]++
            if (diff > 10  && diff <= 15) values[3]++
            if (diff > 15) values[4]++
            console.log(diff);
            count++;
            cbResult(); 
        },function () {
            res.send({count:count,labels:labels,values:values });
        });  
    });

});

getParkingSize = function (db, cb) {
    var labels = ['Small', 'Normal'];
    var values = [0,0];
    db.collection('parking').find({}).toArray(function(err, result) {
        async.each(result, function(park, cbResult) {
            if (park.width === 'Small' ) values[0]++;
            if (park.width === 'Normal' ) values[1]++;
            cbResult(); 
        },function () {
            cb(null, {labels:labels,values:values});
        });
    });
}


getParkingTypes = function (db, cb) {
    var labels = ['Garage', 'Car Park', 'Driveway'];
    var values = [0,0,0];
    var count = 0;

    db.collection('parking').find({}).toArray(function(err, result) {
        async.each(result, function(park, cbResult) {

            if (park.type === 'Garage' ) values[0]++;
            if (park.type === 'Carpark' ) values[1]++;
            if (park.type === 'Driveway' ) values[2]++;
            count++;
            cbResult(); 
        },function () {
            cb(null, {labels:labels,values:values, count:count});
        });
    });
}



getLablesAges = function (cb) {
    labels = ["<20", "20-25", "25-40", "40-60", "+60"]
    cb (null, labels);
}

getUsersAges = function (db, cb) {

    var values = [0,0,0,0,0]
    var year = new Date().getFullYear();
    var age = -1;

    db.collection('users').find({}).toArray(function(err, result) {
        async.each(result, function(usr, cbResult) {
            age = year - usr.birth;
            if (age <= 20 ) values[0]++
            if (age > 20 && age <= 25) values[1]++
            if (age > 25 && age <= 40) values[2]++
            if (age > 40 && age <= 60) values[3]++
            if (age > 60) values[4]++
            cbResult(); 
        },function () {
            cb(null, values);
        });
    });
}

count = function (db, cb) {
	db.collection('users').count(function(err, nb) {
        cb(null, nb);
    });
}

function dateDiff(date1, date2){
    var diff = {}                          
    var tmp = date2 - date1;
 
    tmp = Math.floor(tmp/1000);            
    diff.sec = tmp % 60;                   
 
    tmp = Math.floor((tmp-diff.sec)/60);   
    diff.min = tmp % 60;                   
 
    tmp = Math.floor((tmp-diff.min)/60);    
    diff.hour = tmp % 24;                   
     
    tmp = Math.floor((tmp-diff.hour)/24);  
    diff.day = tmp;
     
    return diff.day;
}


module.exports = router;