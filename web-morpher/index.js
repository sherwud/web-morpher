/*
 * Модуль сервера
 */
/* Необходимые модули */
var path = require('path');
var fs = require('fs');
/* Параметры сервера по умолчанию */
var defaultConfigFile = 'config.json';
var defaultPort = 3000;
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

function wmConstructor(params) {
   var wm = {};
   var globalConfigs = require('./config.json');
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
   var str = path.join(wm.rootSites,wm.pathSite);
   if (fs.existsSync(str)) {
      wm.pathSite = path.join(wm.rootSites,wm.pathSite);
   } else if (!fs.existsSync(wm.pathSite)) {
      console.log('Неверный путь к сайту: '+wm.pathSite);
      return false;
   }
   /* Каталог сайта с файлами WM */
   /* Если каталога нет, то это обычный статический сайт */
   wm.dataWM = {};
   wm.dataWM.path = path.join(wm.pathSite,'web-morpher');
   if (fs.existsSync(wm.dataWM.path)) {
      
   } else {
      wm.typeSite = 0; 
      console.log(' ');
   }
   
   
   
   
   
   console.log('Корень: '+wm.rootSites);
   console.log('Сайт: '+wm.pathSite);
   console.log('Данные WM: '+wm.dataWM.path);
   //console.log(module.parent.filename);
   //console.log('--- '+params.path);
   

   
   wm.configFile =
      $wm.startArgs.config?$wm.startArgs.config:
      params.config?params.config:
      defaultConfigFile;
   var configs = require(wm.wmPath+wm.configFile);
   wm.node_modules =
      configs.node_modules?configs.node_modules:
      globalConfigs.node_modules?globalConfigs.node_modules:
      [];
   if (wm.node_modules instanceof Array) {
      for (var i in wm.node_modules) {
         if (module.paths.indexOf(wm.node_modules[i]) === -1)
            module.paths.push(wm.node_modules[i]);
      }
   }
   console.log(module.paths);
   wm.port =
      $wm.startArgs.port?$wm.startArgs.port:
      params.port?params.port:
      configs.port?configs.port:
      globalConfigs.port?globalConfigs.port:
      defaultPort;
   wm.count = 0;
   wm.start = wmStart;
   
   wm.express = require('express');
   wm.app = wm.express();
   return wm;
}
function wmStart(){
   var wm = this;
   var express = wm.express;
   var app = wm.app;
   
   
   app.use(express.logger());
   app.use(app.router);
    
   var oneYear = 31557600000;
   app.use(express.static(wm.rootPath, { maxAge: oneYear }));
   
   app.get('/', function(req, res, next){
      res.send('hello world: ' + wm.count);
      wm.count++;
   });
   
   
   app.listen(wm.port);
  // console.log('__dirname');
  // console.log('Корень модуля: '+__dirname);
  // console.log('Корень сайта: '+wm.rootPath);
   console.log('Сервер запущен на порту: '+wm.port);
}