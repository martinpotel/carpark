var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;
var paypal = require('paypal-rest-sdk');


function GetCardType(number)
{
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
        return "visa";

    // Mastercard
    re = new RegExp("^5[1-5]");
    if (number.match(re) != null)
        return "mastercard";

    return "";
}



/**

	This method is just for the test, the bank transfer's route needs to
	have a company account and get the informations from a real bank.

*/
router.post('/bank-transfer/', function(req,res) {


	var db = req.app.locals.db;
	var transaction = {
		'type':'bank-transfer',
		'user':req.body.user._id,
		'amount':req.body.user.wallet,
		'date':new Date()
	};

	req.body.user.wallet-= transaction.amount;
	transaction.payment = req.body.bank;

	console.log(req.body.user);

	req.body.user._id = new ObjectId(req.body.user._id);
	console.log('ok');

	db.collection('users').save(req.body.user, function (err, doc) {
		db.collection('transaction').save(transaction, function (err, doc) {								
			res.send(transaction);
		});
	});

});



router.post('/create/', function (req, res) {
	
	var db = req.app.locals.db;
	var booking = req.body.booking;
	booking._id = new ObjectId(booking._id);
	booking.parking = booking.parking._id;	
	var transaction = {
		'type':'credit-card',
		'booking':req.body.booking._id,
		'user':req.body.booking.tenant,
		'amount':req.body.booking.price,
		'date':new Date()
	};
	var payment = {
		"intent": "sale",
		"payer": {
		},
		"transactions": [{
			"amount": {
				"currency": "USD",
				"total": req.body.booking.price
			},
			"description": "rien a dire"
		}]
	};

	payment.payer.funding_instruments = [
		{
			"credit_card": {
        		"number": req.body.card.number,
        		"type": GetCardType(req.body.card.number),
       			"expire_month": req.body.card.expiration.month,
        		"expire_year": req.body.card.expiration.year,
        		"cvv2": req.body.card.number.cvc,
        		"first_name": req.body.card.firstname,
        		"last_name": req.body.card.lastname
      		}
		}
	];
	payment.payer.payment_method = 'credit_card';

	paypal.payment.create(payment, function (error, payment) {
		if (error) {
			console.log(error);
			res.send({ 'error': error }); 
		} else {
			if (!booking.payed) {
				db.collection('booking').findOneAndUpdate({_id: new ObjectId(booking._id)}, {$set: {payed:true}}, function(err, result) {
					db.collection('users').findOne({_id: new ObjectId(booking.owner)}, function(err, user) {
						if(user == null) console.log(err);
						else {
							if (typeof user.wallet === 'undefined') user.wallet = transaction.amount;
							else user.wallet+= transaction.amount;
							user._id = new ObjectId(user._id);
							db.collection('users').save(user, function (err, doc) {
								transaction.payment = payment;
								db.collection('transaction').save(transaction, function (err, doc) {									
									res.send(transaction);
								});
							});
						}			
					});	     
    			});
    		}else{
    			res.send({'error':'Booking already payed'});
    		}	
		}
	});
});

router.init = function (c) {
	config = c;
	paypal.configure(c.api);
};


module.exports = router;