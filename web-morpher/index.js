/*
 * Модуль сервера
 */
/* Необходимые модули */
var path = require('path');
var fs = require('fs');
/* Порт по умолчанию */
var defaultPort = 3000;
/* время жизни статики по умолчанию 1 год */
var lifetimeStatic = 31557600000;
/* Конструктор */
var $wm = exports = module.exports = wmConstructor;
/* парсинг параметров запуска */
$wm.startArgs = {};
for (var i in global.process.argv) {
   if (global.process.argv[i].search('--') !== -1) {
      var val = global.process.argv[i].replace(/--/,'').split(':');
      $wm.startArgs[val[0]]=val[1];
   }
}
/* чтение данных из package.json*/
var packageInfo = require('./package.json');
$wm.info = {};
$wm.info.name = packageInfo.name;
$wm.info.version = packageInfo.version;
$wm.info.versionName = packageInfo.versionName;
$wm.info.author = packageInfo.author;
delete packageInfo;
/* Конструктор объектов wm */
function wmConstructor(params) {
   var wm = {};
   params = params || {};
   /* Каталог откуда запускается модуль */
   /* По факту это корень для расположения сайтов по умолчанию */
   /* Относительные пути будут искаться от этого каталога */
   wm.rootSites = path.normalize(path.dirname(module.parent.filename));
   /* Каталог сайта */
   wm.pathSite = path.normalize(
      $wm.startArgs.path?$wm.startArgs.path:
      params.path?params.path:''
   );
   var buffer = path.join(wm.rootSites,wm.pathSite);
   if (fs.existsSync(buffer)) {
      wm.pathSite = path.join(wm.rootSites,wm.pathSite);
   } else if (!fs.existsSync(wm.pathSite)) {
      console.log('Неверный путь к сайту: '+wm.pathSite);
      return false;
   }
   /* Каталог сайта с файлами WM */
   /* Если каталога нет, то это обычный статический сайт */
   wm.dataWM = {};
   wm.dataWM.path = path.join(wm.pathSite,'web-morpher');
   var localConfigs = {};
   if (fs.existsSync(wm.dataWM.path)) {
      localConfigs = require(path.join(wm.dataWM.path,'config.json'));
      
      wm.typeSite = localConfigs.typeSite?localConfigs.typeSite:1;
   } else {
      wm.dataWM = false;
      wm.typeSite = 0;
   }
   var globalConfigs = require('./config.json');
   /* Пути для поиска модулей */
   if (globalConfigs.node_modules instanceof Array)
      buffer = globalConfigs.node_modules;
   else buffer = [];
   if (localConfigs.node_modules instanceof Array)
      buffer = buffer.concat(localConfigs.node_modules);
   if (buffer instanceof Array) {
      for (var i in buffer) {
         if (module.paths.indexOf(buffer[i]) === -1)
            module.paths.push(buffer[i]);
      }
   }
   wm.port =
      $wm.startArgs.port?$wm.startArgs.port:
      params.port?params.port:
      localConfigs.port?localConfigs.port:
      defaultPort;

   wm.start = wmStart;
   
   wm.parser = require('./ulib/parser.js');

   wm.express = require('express');
   wm.app = wm.express();
   return wm;
}
function wmStart(){
   var wm = this;
   var express = wm.express;
   var app = wm.app;
   
   
   //app.use(express.logger());
   //app.use(app.router);
   
   app.get('/web-morpher/:libDir/*', function(req, res, next){
      var libDir = req.params.libDir;
      if (libDir==='ui' || libDir==='ulib') {
         var file = wm.rootSites+req.path;
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
   app.get('/t',function(req, res){
      res.send(404, wm.parser.build([1]));
   });
   switch (wm.typeSite) {
      case 1: /* Статика c ресурсами и конфигами WM */
         __start1(wm); break;
      case 0: /* Статика без ресурсов и конфигов WM */
      default : __start0(wm);
   }
   
   app.listen(wm.port);
   console.log('Сайт: '+wm.pathSite);
   console.log('Запущен на порту: '+wm.port);
}
function __start0(wm) {
   var express = wm.express;
   var app = wm.app;
   app.use(express.static(wm.pathSite, { maxAge: lifetimeStatic }));
}
function __start1(wm) {
   var express = wm.express;
   var app = wm.app;
   app.get('/web-morpher/*', function(req, res){
      res.send($wm.info);
   });
   app.use(express.static(wm.pathSite, { maxAge: lifetimeStatic }));
}