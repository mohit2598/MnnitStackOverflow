var socket = require('socket.io');
var bodyParser =require('body-parser');
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
      var sql = "INSERT INTO data (fname, lname, username, content) VALUES (?,?,?,?)";
      con.query(sql,[data.fn,data.ln,data.un,data.ms],function(err,result){
        if(err) throw err;
        console.log("data entered");
        var qid = "SELECT id FROM data WHERE username=? AND content=?";
        con.query(qid,[data.un,data.ms],function(err,result){
          if(err) throw err;
          data.id=result[0].id;
          console.log("id found:"+data.id);
          var createQtable = "CREATE TABLE qid"+data.id+" (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) NOT NULL, answer TEXT NOT NULL, time DATETIME NOT NULL)";
          con.query(createQtable,function(err,result){
            if(err) throw err;
            console.log("separate table for question created");
          });
          io.sockets.emit('newPost',data);
        });
        console.log("New post recieved");
      });
    });
  });

  app.get('/',function(req,res){
      var sql = "SELECT * FROM data";
      con.query(sql,function(err,result,fields){
        if(err) throw err;
        res.render('post_section.ejs',{postcontent:result,loginErr:loginErr,display:display,loggedIn:req.session.loggedIn});
        loginErr=null;
        display=false;
      });
  });

  app.post('/newAcc',function(req,res){
    if (!req.body)  return res.sendStatus(400);
    var sql= "INSERT INTO userdata (firstname,lastname,username,password) VALUES (?,?,?,?)";
    con.query(sql,[req.body.fname,req.body.lname,req.body.username,req.body.password],function(err,result){
      if(err) throw err;
      loginErr="Account Created";
      display=true;
    });
    res.redirect('..');
    console.log("request :",req.body);
  });

  app.get('/login',function(req,res){
    res.render('loginPage',{loginErr:loginErr,display:display,loggedIn:req.session.loggedIn});
    loginErr=null;
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
          loginErr="Login Succesfull";
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
          loginErr="Login Unsuccessfull";
        }
      }
      else {
        console.log("Login Unsuccessfull");
          loginErr="Login Unsuccessfull";
      }
      console.log(loginErr);
      display=true;
      res.redirect('/');
    });

  });

  app.get('/create',function(req,res){
    res.render('basic.ejs',{loginErr:loginErr,display:display,loggedIn:req.session.loggedIn});
    loginErr=null;
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

  app.get('/profile/:username',function(req,res){
    console.log(req.params.username);
    res.end(req.params.username);
  });

  app.get('/question/:id',function(req,res){
    console.log(req.params.id);
    var sql = "SELECT * FROM qid"+req.params.id;
    var sql2 = "SELECT * FROM data WHERE id=?";
    con.query(sql,function(err,results){
      if(err) throw err;
      console.log(results);
      if(results[0]){
        con.query(sql2,[req.params.id],function(err,result){
          if(err) throw err;
          res.render('question.ejs',{qtable:results,ques:result,loggedIn:req.session.loggedIn,loginErr:loginErr,display:display,answered:true});
          loginErr=null;
          display=false;
        });
      }
        else{
          con.query(sql2,[req.params.id],function(err,result){
            if(err) throw err;
            res.render('question.ejs',{qtable:null,ques:result[0],loggedIn:req.session.loggedIn,loginErr:loginErr,display:display,answered:false});
            loginErr=null;
            display=false;
          });
        }

    });
  });

};
