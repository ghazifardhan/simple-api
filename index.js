var express = require('express');
var mongodb = require('mongodb').MongoClient;
var bodyparser = require('body-parser');
var app = express();

mongodb.connect('mongodb://localhost:27017/cermai', function(err, db) {
	if(err) throw err;
	var ApiHandler = require('./routes/api');
	var API = new ApiHandler(db);

	app.use(bodyParser.json());
	app.liste(2016, function() {
		console.log("Application Listen on port", 2016)
	});
});

app.get("/", API.index);
app.post("/api/auth", API.auth);
