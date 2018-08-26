var http = require('http');
var express =require('express');
var socket = require('socket.io');
var loginc = require('./controllers/loginc');

var app=express();

loginc(app);
app.set('view engine', 'ejs');
app.use('/static',express.static('static'));
var server = app.listen(9000,'192.168.31.109');
console.log('Listening to port 9000..');
var io=socket(server);
io.on('connection',function(socket){
  console.log('User connected with ID:' + socket.id);
  socket.on('newPost',function(data){
    io.sockets.emit('newPost',data);
  });
});
