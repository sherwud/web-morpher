/*
 * Модуль сервера
 */
/* Параметры сервера по умолчанию */
var defaultRootPath = '../demo/';
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

function wmConstructor(rootPath,configFile,port) {
   var wm = {};
   var globalConfigs = require('./config.json');
   wm.rootPath =
      $wm.startArgs.path?$wm.startArgs.path:
      rootPath?rootPath:
      defaultRootPath;
   if (wm.rootPath[wm.rootPath.length-1]!=='/') wm.rootPath+='/';
   wm.wmPath = wm.rootPath+'web-morpher/'
   wm.configFile =
      $wm.startArgs.config?$wm.startArgs.config:
      configFile?configFile:
      defaultConfigFile;
   
   var configs = require(wm.wmPath+wm.configFile);
   
   
   wm.port =
      $wm.startArgs.port?$wm.startArgs.port:
      port?port:
      defaultPort;
   wm.start = wmStart;
   return wm;
}

function wmStart(){
   console.log('Корень сайта: '+this.rootPath);
   console.log('Сервер запущен на порту: '+this.port);
}

/*
wm = {};
module.exports = wmConstructor();
function wmConstructorOLD() {


   // параметры
   var args = parseArgv();
   var configs = require('./'+(args.config || 'config.json'));
   if (configs.paths instanceof Array) {
      for (var i in configs.paths) {
         module.paths.push(configs.paths[i]);
      }
   }
   var port = args.port || configs.port || 3000;
   var packageInfo = require('./package.json');

   // запуск сервера
   var express = require('express');
   var app = express();
   app.use(express.logger());
   app.use(app.router);
   app.get('/', function(req, res, next){
      res.send('hello world');
   });   
   app.listen(port);

   // вывод
   if (args.config)
      console.log('Использован файл настроек: '+args.config);
   console.log('Сервер запущен на порту: '+port);
   wm.info = function(){
      var info = {
         name:packageInfo.name,
         version:packageInfo.version,
         versionName:packageInfo.versionName,
         author:packageInfo.author
      };
      return info;
   }
   delete args;
   delete configs;
   delete packageInfo;
   return wm;
}
*/