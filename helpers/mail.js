var ObjectId = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');


exports.prepareMail = function ( to, nameMail, db, callback) {
	console.log("ok");

	db.collection('mail').findOne( {route : nameMail }, function(err, mail) {
		var transporter = nodemailer.createTransport({
    			service: 'gmail',
    			auth: {
       				user: 'mrtn.potel@gmail.com',
        			pass: 'ANZMBS5457'
    			}
    		});


		var mailOptions = {
    		from: '"Fred Foo 👻" <foo@blurdybloop.com>', 
   			to: to,
   			subject: mail.subject,
    		text: mail.contenttext,
    		html: mail.contenthtml
		};

		transporter.sendMail(mailOptions, function (error, info){
    		if (error) {
        		return console.log(error);
    		}
    		console.log('Message %s sent: %s', info.messageId, info.response);
		});
	});
}

