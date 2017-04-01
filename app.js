/* Require express components */
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');

/* Require routes files */
var routes = require('./routes/index');
var api = require('./routes/api');
var user = require('./routes/user');
var parking = require('./routes/parking');
/* Initialize express app */
var app = express();

/* View engine (ejs) setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



/* Setup express modules */
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/components',  express.static(path.join(__dirname, '/bower_components')));

require('./config/passport')(passport); // pass passport for configuration

// required for passport
app.use(session({ 
    secret: 'nantes01' ,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


/* Instantiate routes */
app.use('/', routes);
app.use('/api', api);
app.use('/user', user);
app.use('/parking', parking);
app.use('/public',  express.static(path.join(__dirname, '/public')));
/* Catch 404 and forward to error handler */
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


/* Development error handler */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/* Serve app */
module.exports = app;
