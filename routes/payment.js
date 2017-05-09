var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;


router.post('/new/', function (req, res) {
    console.log(req.body);
    var db = req.app.locals.db;
    res.send('ok');
});

module.exports = router;