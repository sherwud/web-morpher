var $core = exports = module.exports;
var path = require('path');
var fs = require('fs');
/* время жизни статики по умолчанию 1 год */
var lifetimeStatic = 31557600000;
$core.start = function(wm){
   var express = wm.express;
   var app = wm.app;
   var wmParser = function(){
      /*тестирование*/
      app.get('/t/:file',function(req, res){
         wm.parser.build([req.params.file],res);
      });
      /**/
   };
   var wmUILIB = function(){
      app.get('/web-morpher/:libDir/*', function(req, res, next){
         var libDir = req.params.libDir;
         if (libDir==='ui' || libDir==='ulib') {
            var file = path.join(wm.rootSites,req.path);
            fs.stat(file, function(err, stats){
               if (!err && stats.isFile())
                  res.sendfile(file);
               else
                  res.send(404, 'File not found');
            });
         } else {
            next();
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
   app.use(express.static(wm.pathSite, { maxAge: lifetimeStatic }));
};