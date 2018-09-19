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

    socket.on('newQuestion',function(data){
      var sql = "INSERT INTO questions (fullname, author, content) VALUES (?,?,?)";
      var info = JSON.parse(data.info);
      addCuriosity(info.author);
      con.query(sql,[info.fullname,info.author,data.ques],function(err,result){
        if(err) throw err;
        console.log("data entered");
        io.sockets.emit('newQuestion',data);
        });
        console.log("New ques recieved");
      });

    socket.on('newAnswer',function(data){
      console.log(data);
      var info = JSON.parse(data.info);
      addStar(info.author);
      var sql = "INSERT INTO answers (qid,answer,author) VALUES (?,?,?)";
      con.query(sql,[info.qid,data.ans,info.author],function(err,result){
        if(err) throw err;
        con.query("UPDATE questions SET answered=true WHERE id=?",[info.qid]);
        console.log("answer inserted");
        io.sockets.emit('newAnswer',true);
      });
  });
});

  app.get('/',function(req,res){
      var sql = "SELECT author,content,id FROM questions";
      con.query(sql,function(err,result,fields){
        if(err) throw err;
        console.log(result);
        res.render('post_section.ejs',{postcontent:result,loginErr:loginErr,display:display,loggedIn:req.session.loggedIn});
        loginErr=null;
        display=false;
      });
  });

  app.post('/newAcc',function(req,res){
    if (!req.body)  return res.sendStatus(400);
    var sql= "INSERT INTO userdata (fullname,username,password,email) VALUES (?,?,?,?)";
    con.query(sql,[req.body.fname+" "+req.body.lname,req.body.username,req.body.password,req.body.email],function(err,result){
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
    var usernameQuery = "SELECT fullname,username,password FROM userdata WHERE username= ?";
    con.query(usernameQuery,[req.body.username],function(err,result){
      if(err) throw err;
      if(result[0]) {
        if(result[0].password===req.body.password){
          console.log("Login Successfull");
          loginErr="Login Successfull";
          req.session.loggedIn = {
            is:true,
            fullname:result[0].fullname,
            uname:result[0].username
          };
          req.session.fullname = result[0].fullname;
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
      res.redirect('../');
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
    var questionSql = "SELECT content,id FROM questions WHERE author=?";
    var userSql = "SELECT fullname,username,email,stars,respect,curiosity FROM userdata WHERE username=?";
    con.query(userSql,[req.params.username],function(err,userResult){
      if(err) throw err;
      con.query(questionSql,[req.params.username],function(err,quesResult){
        if(err) throw err;
        res.render('profile.ejs',{user:userResult[0],questions:quesResult,loggedIn:req.session.loggedIn,loginErr:loginErr,display:display});
      });
    });
  });

  app.get('/question/:id',function(req,res){
    console.log(req.params.id);
    var sql = "SELECT * FROM answers WHERE qid=?";
    var sql2 = "SELECT author,content,timestamp,answered,id FROM questions WHERE id=?";
          con.query(sql2,[req.params.id],function(err,result){
            if(err) throw err;
            if(result[0].answered){
              con.query(sql,[req.params.id],function(err,answers){
                if(err) throw err;
                res.render('question.ejs',{answers:answers,ques:result[0],loggedIn:req.session.loggedIn,loginErr:loginErr,display:display});
                loginErr=null;
                display=false;
              });
            }
              else {
                res.render('question.ejs',{answers:null,ques:result[0],loggedIn:req.session.loggedIn,loginErr:loginErr,display:display});
                loginErr=null;
                display=false;
              }
          });

    });
    app.post('/updateVote',function(req,res){
      var info=JSON.parse(req.body.uname);
      var sql2="SELECT aid FROM votes WHERE username=? AND aid=?"
      con.query(sql2,[info.author,req.body.aid],function(err,result){
        console.log("votes added");
        if(!result[0]){
          addVote(req.body.aid,info.author);
          res.send("success");
        }
      });


    });

    function addVote(aid,user){
      var sql="UPDATE answers SET upvotes=upvotes+1 WHERE aid=?";
      con.query(sql,aid,function(err,result){
        console.log("votes updated");
      });
      var sql2="INSERT INTO votes (username,aid) VALUES (?,?)";
      con.query(sql2,[user,aid],function(err,result){
        console.log("votes added");
      });
    }
    function addStar(user){
      var sql="UPDATE userdata SET stars=stars+1 WHERE username=?";
      con.query(sql,user,function(err,result){
        console.log("Stars updated");
      });
    }
    function addRespect(user){
      var sql="UPDATE userdata SET respect=respect+1 WHERE username=?";
      con.query(sql,user,function(err,result){
        console.log("Respect updated");
      });
    }
    function addCuriosity(user){
      var sql="UPDATE userdata SET curiosity=curiosity+1 WHERE username=?";
      con.query(sql,user,function(err,result){
        console.log("Curiosity updated");
      });
    }

};
