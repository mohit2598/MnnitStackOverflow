var http = require('http');
var express =require('express');

var loginc = require('./controllers/loginc');

var app=express();
//yo yo yo yo
//yo yo
loginc(app);

app.set('view engine', 'ejs');
app.use('/static',express.static('static'));
