/*
* Модуль сервера
*/
wm = {}
module.exports = wmConstructor();
function wmConstructor() {
   /* парсинг параметров запуска */
   function parseArgv(){
      var argv = global.process.argv;
      var arg = {};
      for (var i in argv) {
         if (argv[i].search('--') !== -1) {
            var val = argv[i].replace(/--/,'').split(':');
            arg[val[0]]=val[1];
         }
      }
      return arg;
   }

   /* параметры */
   var args = parseArgv();
   var configs = require('./'+(args.config || 'config.json'));
   if (configs.paths instanceof Array) {
      for (var i in configs.paths) {
         module.paths.push(configs.paths[i]);
      }
   }
   var port = args.port || configs.port || 3000;
   var packageInfo = require('./package.json');

   /* запуск сервера */
   var express = require('express');
   var app = express();
   app.use(express.logger());
   app.use(app.router);
   app.get('/', function(req, res, next){
      res.send('hello world');
   });   
   app.listen(port);

   /* вывод */
   if (args.config)
      console.log('Использован файл настроек: '+args.config);
   console.log('Сервер запущен на порту: '+port);
   wm.info = function(){
      var info = {
         name:packageInfo.name,
         version:packageInfo.version,
         versionName:packageInfo.versionName,
         author:packageInfo.author
      }
      return info;
   }
   delete args;
   delete configs;
   delete packageInfo;
   return wm;
}