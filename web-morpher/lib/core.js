var $core = exports = module.exports;
var path = require('path');
var fs = require('fs');
/* время жизни статики по умолчанию 1 год */
var lifetimeStatic = 31557600000;
$core.start = function(){
   var wm = this;
   var express = wm.express;
   var app = wm.app;
   var wmUILIB = function(){
      app.get('/web-morpher/:libDir/*',function(req,res,next){
         var libDir = req.params.libDir;
         if (libDir==='ui' || libDir==='ulib'){
            var file = path.join(wm.rootSites,req.path);
            fs.stat(file,function(err,stats){
               if (!err && stats.isFile())
                  if (req.header("Cache-Control"))
                     res.sendfile(304);
                  else
                     res.sendfile(file);
               else
                  res.send(404);
            });
         } else {
            next();
         }
      });
   };
   var upload = function(){
      app.post('/upload',function(req,res){
         var form = new wm.formidable.IncomingForm();
         //form.uploadDir = path.join(wm.dataWM.path,'~upload');
         //console.log(form);
         form.parse(req, function(err, fields, files) {
            //console.log(files);
            fs.readFile(files.image.path,'base64',function(e, data){
               if (e) console.log(e);
               else {
                  var image = 'data:' + files.image.type + ';base64,'+data;
                  fs.unlink(files.image.path);
                  res.send(200,'<img src="'+image+'"/>');
               }
            });
         });
         /*
         fs.rename(files.image.path, 
            path.join(path.dirname(files.image.path),files.image.name),
            function(err) {
               if (err) {
                  console.log(err);
               }
            }
         );*/
         //console.log(files);
         //res.send(200,'файл загружен!');
      });
   };
   var wmParser = function(req,res,next){
      var file = req.path;
      if (file[file.length-1] === '/') file += 'index.html';
      var extname = path.extname(file);
      if (extname === '') file += extname = '.html';
      switch (extname) {
         case '.html':
            wm.parser.build(file,req.query,function(e,data){
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
   };
   var wmInfo = function(){
      app.get('/web-morpher',function(req,res){
         res.send(wm.info);
      });
      app.get('/web-morpher/*',function(req,res){
         res.send(wm.info);
      });
   };
   switch (wm.typeSite){
      case 1: /* Статика */
         wmUILIB();
         wmInfo();
      break;
      case 2: /* Динамика */
         wmUILIB();
         wmInfo();
         upload();
         app.get('/*',wmParser);
      break;
   }
   app.get('/*',function(req,res,next){
      var file = req.path;
      if (file[file.length-1] === '/') file += 'index.html';
      var extname = path.extname(file);
      if (extname === '') file += extname = '.html';
      file = path.join(wm.pathSite,file);
      fs.stat(file,function(err,stats){
         if (!err && stats.isFile())
            next();
         else
            res.send(404,'Not found');
      });
   });
   app.use(express.static(wm.pathSite,{ maxAge: lifetimeStatic }));
};