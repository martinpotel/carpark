var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var bcrypt   = require('bcrypt-nodejs');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

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

router.get('/logged-user/', function (req, res) {
    if (typeof req.user === 'undefined') res.send('undefined');
    else res.send(req.user);
});


router.post('/create-user/', function (req, res) {
    var db = req.app.locals.db;
    console.log(req);   
    db.collection('users').save(req.body.newUser, function(err, tuto) {
        res.send('ok');
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


module.exports = router;