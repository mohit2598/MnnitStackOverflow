var bodyParser =require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const testFolder = 'E:\\project\\fresh\\n';
const fs = require('fs');
var filename = [];
fs.readdir(testFolder, function(err, files){
  files.forEach(function(file){
    filename.push(file);
    console.log(file);
  });
});


module.exports = function(app){
  app.get('/',function(req,res){
    res.render('index.ejs');
  });
  app.get('/test',function(req,res){

    res.render('basic.ejs',{items:filename});
  });
  app.post('/test', urlencodedParser ,function(req,res){
    if (!req.body)  return res.sendStatus(400);
    res.render('basic2.ejs',{user:req.body});
  });
};
