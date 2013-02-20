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
      app.get('/web-morpher/:libDir/*', function(req, res, next){
         var libDir = req.params.libDir;
         if (libDir==='ui' || libDir==='ulib') {
            var file = path.join(wm.rootSites,req.path);
            fs.stat(file, function(err, stats){
               if (!err && stats.isFile())
                  res.sendfile(file);
               else
                  res.send(404);
            });
         } else {
            next();
         }
      });
   };
   var wmParser = function(){
      app.get('/*',function(req, res, next){
         var file = req.path;
         if (file[file.length-1] === '/') file += 'index.html';
         var extname = path.extname(file);
         if (extname === '') file += extname = '.html';
         switch (extname) {
            case '.html':
               wm.parser.build.call(wm,file,function(e,data){
                  if (e) {
                     console.log(e);
                     res.send(500);
                  } else {
                     res.send(200,data);
                  }
               });
            break;
            default: next();
         }
      });
   };
   var wmInfo = function(){
      app.get('/web-morpher', function(req, res){
         res.send(wm.info);
      });
      app.get('/web-morpher/*', function(req, res){
         res.send(wm.info);
      });
   };
   switch (wm.typeSite) {
      case 1: /* Статика */
         wmUILIB();
         wmInfo();
      break;
      case 2: /* Динамика */
         wmUILIB();
         wmParser();
         wmInfo();
      break;
   }
   app.get('/*',function(req, res, next){
      var file = req.path;
      if (file[file.length-1] === '/') file += 'index.html';
      var extname = path.extname(file);
      if (extname === '') file += extname = '.html';
      file = path.join(wm.pathSite,file);
      fs.stat(file, function(err, stats){
         if (!err && stats.isFile())
            next();
         else
            res.send(404, 'Not found');
      });
   });
   app.use(express.static(wm.pathSite, { maxAge: lifetimeStatic }));
};