var http = require('http');
var express =require('express');
//yo its done varun
//yo yo
var loginc = require('./controllers/loginc');

var app=express();

loginc(app);

app.set('view engine', 'ejs');
app.use('/static',express.static('static'));
