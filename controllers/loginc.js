var bodyParser =require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
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
  console.log("succesfull");
});





module.exports = function(app){
  app.get('/',function(req,res){

      var sql = "SELECT * FROM data";
      con.query(sql,function(err,result,fields){
        if(err) throw err;
        res.render('post_section.ejs',{postcontent:result});
      });


  });

  app.post('/filemaintainer', urlencodedParser, function(req,res){

      var sql = "INSERT INTO data (fname, lname, content) VALUES ('"+req.body.fn+"','"+req.body.ln+ "','"+ req.body.ms+"')";
      con.query(sql,function(err,result){
        if(err) throw err;
        console.log("data entered");
      });
      console.log(req.body);
      res.send("ok");
  });

  app.get('/test',function(req,res){
    res.render('basic.ejs');
  });

  app.post('/newAcc', urlencodedParser ,function(req,res){
    if (!req.body)  return res.sendStatus(400);
    res.redirect('..')
    console.log("request :",req.body);
  });

  app.get('/create',function(req,res){
    res.render('basic.ejs');
  })

};
