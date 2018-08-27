var socket = require('socket.io');
var bodyParser =require('body-parser');
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
//const testFolder = 'E:\\project\\fresh\\n';
//const fs = require('fs');
//var filename = [];
//fs.readdir(testFolder, function(err, files){
//  files.forEach(function(file){
//    filename.push(file);
//    console.log(file);
//  });
//});
var fs = require('fs');
var mysql = require('mysql');
var expressValidator = require('express-validator');
var expressSession = require('express-session');

var con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database: 'posts'
});
var flag=0;
con.connect(function(err){
  if(err){
    flag=1;
    throw err;
  }
  console.log("connected to mysql");
});





module.exports = function(app){

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(expressValidator());
  app.use(expressSession({secret:'dogra', saveUninitialized:false, resave:false}))

  var loginErr=false;    //to display login error
    var display=false;    //to display modal for errors
      var error = false;  //to display Account creation error
  var server = app.listen(9000,'192.168.31.109');
  console.log('Listening to port 9000..');
  var io=socket(server);
  io.on('connection',function(socket){
    console.log('User connected with ID:' + socket.id);
    socket.on('newPost',function(data){
      console.log("New post recieved");
      io.sockets.emit('newPost',data);
    });
  });


  app.get('/',function(req,res){
      var sql = "SELECT * FROM data";
      con.query(sql,function(err,result,fields){
        if(err) throw err;
        res.render('post_section.ejs',{postcontent:result,loginErr:loginErr,display:display,loggedIn:req.session.loggedIn});
        loginErr=false;
        display=false;
      });


  });

  app.post('/filemaintainer', function(req,res){

      var sql = "INSERT INTO data (fname, lname, username, content) VALUES (?,?,?,?)";
      con.query(sql,[req.session.fname,req.session.lname,req.session.username,req.body.ms],function(err,result){
        if(err) throw err;
        console.log("data entered");
      });
      console.log(req.body);
      res.send("ok");
  });

  app.get('/test',function(req,res){
    res.render('basic.ejs');
  });



  app.post('/newAcc',function(req,res){
    if (!req.body)  return res.sendStatus(400);

    var sql= "INSERT INTO userdata (firstname,lastname,username,password) VALUES (?,?,?,?)";
    con.query(sql,[req.body.fname,req.body.lname,req.body.username,req.body.password],function(err,result){
      if(err) throw err;
      error="Account Created";
    });
    res.redirect('../create');
    console.log("request :",req.body);
  });

  app.get('/login',function(req,res){
    res.render('loginPage',{loginErr:loginErr,display:display,loggedIn:req.session.loggedIn});
    loginErr=false;
    display=false;
  });

  app.get('/logout',function(req,res){
    req.session.destroy();

    res.redirect('..');
  });


  app.post('/login',function(req,res){
    if(!req.body) return res.sendStatus(400);
    var usernameQuery = "SELECT * FROM userdata WHERE username= ?";
    con.query(usernameQuery,[req.body.username],function(err,result){
      if(err) throw err;
      if(result[0]) {
        if(result[0].password===req.body.password){
          console.log("Login Succesfull");
          loginErr=false;
          req.session.loggedIn = {
            is:true,
            fname:result[0].firstname,
            lname:result[0].lastname,
            uname:result[0].username
          };
          req.session.fname = result[0].firstname;
          req.session.lname = result[0].lastname;
          req.session.username = result[0].username;
        }
        else {
          console.log("Login Unsuccessfull");
          loginErr=true;
        }
      }
      else {
        console.log("Login Unsuccessfull");
          loginErr=true;
      }
      console.log(loginErr);
      display=true;
      res.redirect('/');
    });

  });

  app.get('/create',function(req,res){
    res.render('basic.ejs',{err:error,loginErr:loginErr,display:display,loggedIn:req.session.loggedIn});
    loginErr= false;
    error=false;
    display=false;
  });

  app.post('/checkUsername',function(req,res){
    console.log(req.body);
    var sql = "SELECT username FROM userdata WHERE username=?";
    con.query(sql,[req.body.username],function(err,result){
      if(err) throw err;
      if(result[0]){
        res.send("taken");
      }
      else {
        res.send("available");
      }
    });
  });

};
