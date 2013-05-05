var path = require('path');
var fs = require('fs');
var helper = require('./helper.js');
exports = module.exports = coreConstructor;
function coreConstructor(serv){
   if (!(this instanceof coreConstructor)) {return new coreConstructor(serv);}
   var formidable = require(findNodeModule('formidable'));
   var parser = require('./ulib/parser.js');
   var parserLoder = require('./lib/parserLoder.js');

   var $wm = this;
   
   proxy(serv);
}

function proxy(serv){
   var express = serv.express;
   var app = serv.app;
   function sendfile(req,res,file){
      fs.stat(file,function(err,stats){
         if (!err && stats.isFile())
            if (req.header("Cache-Control"))
               res.send(304,'Not Modified');
            else
               res.sendfile(file);
         else
            res.send(404,'Not found');
      });
   }
   function sendwi(req,res){
      var file = path.join(serv.glPath.wi,helper.cutDir(req.path,'/wm/wi'));
      sendfile(req,res,file);
   }
   function sendulib(req,res){
      var file = path.join(serv.glPath.wmulib,
         helper.cutDir(req.path,'/wm/wi/ulib'));
      sendfile(req,res,file);
   }
   function checkfile(req,res,next){
      var file = req.path;
      if (file[file.length-1] === '/') file += 'index.html';
      var extname = path.extname(file);
      if (extname === '') file += extname = '.html';
      file = path.join(serv.path.site,file);
      fs.stat(file,function(err,stats){
         if (!err && stats.isFile())
            next();
         else
            res.send(404,'Not found');
      });
   }
   function showinfo(req,res){
      res.send(serv.info());
   }
   function parser(req,res,next){
      var file = req.path;
      if (file[file.length-1] === '/') file += 'index.html';
      var extname = path.extname(file);
      if (extname === '') file += extname = '.html';
      switch (extname) {
         case '.html':
            serv.parser.build(file,req.query,function(e,data){
               if (e){
                  if (e.HTTPCODE === 304){
                     next();
                  } else {
                     res.send(e.HTTPCODE||500);
                     console.error(e);
                  }
               } else {
                  res.send(200,data);
               }
            });
         break;
         default: next();
      }
   }
   app.get('/wm/wi/lib/*',sendwi);
   app.get('/wm/wi/ext/*',sendwi);
   app.get('/wm/wi/ulib/*',sendulib);
   if (serv.conf.showInfo) {
      app.get('/wm',showinfo);
      app.get('/wm/*',showinfo);
   }
   app.get('/*',parser);
   app.get('/*',checkfile);
   app.use(express.static(serv.path.site));
}