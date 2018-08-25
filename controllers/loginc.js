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

module.exports = function(app){
  app.get('/',function(req,res){
    res.render('post_section.ejs');
  });

  app.post('/filemaintainer', urlencodedParser, function(req,res){
      fs.appendFile('posts.txt', JSON.stringify(req.body) , function(err){
        if(err) throw err;
      });
      console.log(req.body);
      res.send("ok");
  });

  app.get('/test',function(req,res){
    res.render('basic.ejs');
  });

  app.post('/test', urlencodedParser ,function(req,res){
    if (!req.body)  return res.sendStatus(400);
    res.render('basic2.ejs',{user:req.body});
  });
};
