var http = require('http');
var express =require('express');
//yo oyooyoyoy oykyoykoyomo yoykoykoo
var loginc = require('./controllers/loginc');

var app=express();

loginc(app);

app.set('view engine', 'ejs');
app.use('/static',express.static('static'));
