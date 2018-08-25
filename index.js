var http = require('http');
var express =require('express');

var loginc = require('./controllers/loginc')

var app=express();


loginc(app);
app.set('view engine', 'ejs');
app.use('/static',express.static('static'));
app.use('/n',express.static('n'));
app.listen(9000,'192.168.31.109');
console.log('Listening to port 9000..');
