var ObjectId = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');


exports.prepareMail = function ( to, nameMail, db, callback) {

    console.log('mailtosend:',to);

	db.collection('mail').findOne( {name : nameMail }, function(err, mail) {
		var transporter = nodemailer.createTransport({
    			service: 'Mailgun',
    			auth: {
       				user: 'postmaster@sandbox85afa0ca87df4bd79f3b2a02aa2c5541.mailgun.org',
        			pass: '73dfde49f9af54469242603cf639990e'
    			}
    		});


		var mailOptions = {
    		from: 'mrtn.potel@gmail.com', 
   			to: 'mrtn.potel@gmail.com',
   			subject: mail.subject,
    		text: mail.contenttext,
    		html: mail.contenthtml
		};

		transporter.sendMail(mailOptions, function (error, info){
    		if (error) {
                console.log('Mail not sent');
                console.log(error)
    		}else{
                console.log('Message sent:', mailOptions);
            }
    		callback('ok');
		});
	});
}

