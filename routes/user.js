var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var mailService = require('../helpers/mail');
var async = require('async');

//register
router.post('/user-check-info/', function(req, res) {
    var db = req.app.locals.db;
    if(typeof req.body.mail !== 'undefined') {
        db.collection('users').find({mail:req.body.mail}).count(function(err, count) {
            if(count == 0) res.send(true);
            else res.send(false);
        });
    }
});

/* ---------------------- PASSPORT STRATEGIES ---------------------------- */
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new LocalStrategy({passReqToCallback: true},
    function(req, username, password, done) {
        var db = req.app.locals.db;
        var poCollection = db.collection('users');
        poCollection.findOne({mail:username},function(err, result) {
            if (!result) {
                return done(null, false);
            }
            else if(password !== result.password) {
                return done(null, false);
            }
            else {
                delete result.defaultmailcustomer;
                delete result.defaultobjectcustomer; //TODO
                var logsCollection = db.collection('userlogs');
                logsCollection.save({'date':new Date(), 'user_id':result._id.toString()}, function (err, doc) {
                    return done(null, result);
                });
            }
        });
    }
));

router.get('/all', function(req, res) {
    var db = req.app.locals.db;
    var users = db.collection('users'); 
    users.find({}).toArray(function(err, result) {
        if(result == null) res.send({'error': 'Not found'});
        else {
            res.send(result);
        }
    });
});

router.get('/logged-user/', function (req, res) {
    if (typeof req.user === 'undefined') res.send('undefined');
    else res.send(req.user);
});

router.get('/admin-user/', function (req, res) {
    if (typeof req.user === 'undefined') res.send('undefined');
    else {
        res.send(req.user.admin);
    }
});


router.get('/logs/:id', function(req, res) {
    var db = req.app.locals.db;
    var userLogs = db.collection('userlogs');
    userLogs.find({user_id: req.params.id}).toArray(function(err, logs) {
        if(logs == null) res.send({'error': 'Not found'});
        else {
            res.send(logs);
        }
    });
});


router.post('/create-user/', function (req, res) {
    
    console.log('ok');

    var db = req.app.locals.db;
    req.body.newUser.admin = false;  
    req.body.newUser.wallet = 0;
    db.collection('users').save(req.body.newUser, function(err, usr) {
        console.log('ok');
        mailService.prepareMail('C00221534@itcarlow.ie', 'welcome', db, function() {
            res.send('ok');
        });
        
    });
});


router.post('/Login', passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/#/login',
    failureFlash: true
}));

router.get('/Logout', function(req, res){
    req.flash('info', 'Logged out');
    req.logout();
    res.redirect('/');
});


router.post('/update-profile/', function(req,res){
    console.log(req.body.user);

    var db = req.app.locals.db;
    var usersCollection = db.collection('users');
    var userToSave = req.body.user;
    userToSave._id = new ObjectId(req.body.user._id);
    usersCollection.save(userToSave, function (err, doc) {
        req.logIn(userToSave, function(error) {
            if (!error) {
                res.send(req.user);
            }
        });
        
    });
});


module.exports = router;