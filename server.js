const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.set('port', PORT);

app.use(express.static(__dirname + '/site'));

app.all('/*', function(req, res, next) {
	res.sendFile('index.html', { root: __dirname + "/site" });
});

var server = app.listen(app.get('port'), function() {
	var port = server.address().port;
	console.log('This Works' + " " + port);
});