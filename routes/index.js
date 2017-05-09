var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var ObjectId = require('mongodb').ObjectID;
var config = {};


/* GET home page. */
router.get('/', function(req, res) {
	var admin = false;

	if (typeof(req.user) !== 'undefined') {
		user = true;
		if (req.user.admin) admin = true;
	}
	else user = false;
	res.render('layout', {user: user, admin:admin, userInfos:req.user});
});

var payment = {
  "intent": "sale",
  "payer": {
    "payment_method": "credit_card",
    "funding_instruments": [{
      "credit_card": {
        "number": "5500005555555559",
        "type": "mastercard",
        "expire_month": 12,
        "expire_year": 2018,
        "cvv2": 111,
        "first_name": "Joe",
        "last_name": "Shopper"
      }
    }]
  },
  "transactions": [{
    "amount": {
      "total": "5.00",
      "currency": "USD"
    },
    "description": "My awesome payment"
  }]
}

function GetCardType(number)
{
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
        return "Visa";

    // Mastercard
    re = new RegExp("^5[1-5]");
    if (number.match(re) != null)
        return "Mastercard";

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
        return "AMEX";

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null)
        return "Discover";

    // Diners
    re = new RegExp("^36");
    if (number.match(re) != null)
        return "Diners";

    // Diners - Carte Blanche
    re = new RegExp("^30[0-5]");
    if (number.match(re) != null)
        return "Diners - Carte Blanche";

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
        return "JCB";

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (number.match(re) != null)
        return "Visa Electron";

    return "";
}


router.create = function (req, res) {
	
	var db = req.app.locals.db;

	var booking = req.body.booking;
	booking._id = new ObjectId(booking._id);
	booking.parking = booking.parking._id;

	
	var transaction = {
		'booking':req.body.booking._id,
		'user':req.body.booking.tenant,
		'amount':req.body.booking.price,
		'date':new Date(),
		'card':req.body.card
	};

	console.log('coucou');
	var payment = {
		"intent": "sale",
		"payer": {
		},
		"transactions": [{
			"amount": {
				"currency": "USD",
				"total": 10.0
			},
			"description": "rien a dire"
		}]
	};


	payment.payer.funding_instruments = [
		{
			"credit_card": {
        		"number": "5500005555555559",
        		"type": "mastercard",
       			"expire_month": 12,
        		"expire_year": 2018,
        		"cvv2": 111,
        		"first_name": "Joe",
        		"last_name": "Shopper"
      		}
		}
	];
	payment.payer.payment_method = 'credit_card';

	paypal.payment.create(payment, function (error, payment) {
		if (error) {
			console.log(error);

			///API PayPAL en attente virement
			
			if (!booking.payed) {
				booking.payed = true;
				db.collection('booking').save(booking, function (err, doc) {
					db.collection('users').findOne({_id: new ObjectId(booking.owner)}, function(err, user) {
						if(user == null) console.log(err);
						else {
							if (typeof user.wallet === 'undefined') user.wallet = transaction.amount;
							else user.wallet+= transaction.amount;
							db.collection('users').save(user, function (err, doc) {
								db.collection('transaction').save(transaction, function (err, doc) {
									//res.send({ 'error': error }); 
									
									res.send(transaction);
									console.log('Fake bank transaction OK');
								});
							});
						}			
					});	     
    			});	
			}else{
				console.log("error:Booking already payed");
				res.send({'error':'Booking already payed'});
			}
			
		} else {
			req.session.paymentId = payment.id;
			res.send({ 'payment': payment });
		}
	});
};

router.execute = function (req, res) {
	var paymentId = req.session.paymentId;
	var payerId = req.param('PayerID');

	var details = { "payer_id": payerId };
	var payment = paypal.payment.execute(paymentId, details, function (error, payment) {
		if (error) {
			console.log(error);
			res.render('error', { 'error': error });
		} else {
			res.render('execute', { 'payment': payment });
		}
	});
};

router.cancel = function (req, res) {
  res.render('cancel');
};

// Configuration

router.init = function (c) {
	config = c;
	paypal.configure(c.api);
};


module.exports = router;
