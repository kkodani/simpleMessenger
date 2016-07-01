var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var reactify   = require('reactify');
var firebase = require('firebase');

var app = express();

app.use(express.static(path.join(__dirname, './client')));
app.use('/node_modules', express.static(__dirname + '/node_modules/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var config = require('./config.js');

firebase.initializeApp(config);
var db = firebase.database();
var chatlog = db.ref("db/chatlog");

app.get('/app-bundle.js',
  browserify('./client/app.js', {
    transform: [reactify]
}));

app.post('/api/sendChat', function(req, res) {

  chatlog.set({
    id: Date.now(),
    text: req.body.text
  });

  res.send(JSON.stringify({key: 6}));
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port 3000...");
