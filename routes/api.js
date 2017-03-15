var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var databasePath = path.resolve(__dirname, '../database/notes.json');


router.get('/users', function(req, res) {
	var db = req.app.locals.db;
	var users = db.collection('users');	
	users.find({}).toArray(function(err, result) {
		if(result == null) res.send({'error': 'Not found'});
		else {
			res.send(result);
		}
	});
});






/*
	Get list of notes from database
	Database is a single JSON file containing an array of notes
*/
router.get('/notes', function(req, res) {
	var notes = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
	res.send(notes);
});

/*
	Get single note from database
*/
router.get('/note/:id', function(req, res) {
	var notes = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
	var result = null;
	notes.forEach(function(note) {
		if(req.params.id == note.id) result = note;
	});
	if(result != null) res.send(result);
	else res.send('Error : not found');
});

router.get('/users', function(req, res) {

});


/*
	Add or edit an existing note
*/
router.post('/note', function(req, res) {
	var newNote = req.body;
	var notes = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
	if(typeof newNote === 'undefined') res.send('Error : no POST data');
	else if(checkNote(newNote) === 'error') res.send('Error : data incorrect');
	else {
		newNote = checkNote(newNote);
		//If no ID, then adding note in database
		if(typeof newNote.id === 'undefined') {
			newNote.id = Math.max.apply(Math, notes.map(function(note) { return note.id; }))+1;
			notes.push(newNote);
		}
		//If there is an ID, we update the note
		else {
			notes.forEach(function(note,key) {
				if(note.id == newNote.id) notes[key] = newNote;
			});
		}

		//Save the new array in JSON file
		fs.writeFile(databasePath, JSON.stringify(notes), function(err, data) {
			if(!err) res.send('ok');
			else res.send('Error : '+err);
		});
	}
});

/*
	Check if note sent from client are matching the model and add constraints
*/
function checkNote(note) {
	//Define note model and copy the note in the model to make sure no other fields are added
	var noteModel = {'id':null,'title':null,'text':null};

	//If note object has no title or text, send error
	if(typeof note.title === 'undefined' || note.text === 'undefined') return 'error';

	//Set note object in model, could add more constraints here ...
	if(typeof note.id !== 'undefined') noteModel.id = parseInt(note.id); //Force ID to be integer
	else delete noteModel.id;
	noteModel.title = note.title;
	noteModel.text = note.text;
	return noteModel;
}

module.exports = router;
