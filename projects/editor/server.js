var express = require('express');
var Read = require('./read');
var app = express();

app.use(express.bodyParser());

app.get('/', function(req, res){
   res.sendfile('index.html');
});

app.post('/', function(req, res){
   if(req.body['type']==='List'){
      data = req.body['path'];
      if(data){
         var list = Read.nodelist(data);
         res.end(list);
      }
      else{
         res.end('file not found');
         console.error('file not found');
      }
   }
   else if(req.body['type']==='SaveFile'){
      if(req.body['path']){
         Read.SaveFile(req.body['path'], req.body['content']);
         res.end('data has been successfully saved');
      }
      else {
         res.end('invalid path');
         console.error('invalid path');
      }
   }
   else {
      res.end('invalid request');
      console.error('invalid request');
   }

});

app.listen(1337);