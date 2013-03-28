/*
 * Модуль сервера
 */
/* Необходимые модули */
var path = require('path');
var fs = require('fs');
/* Порт по умолчанию */
var defaultPort = 3000;
/* Конструктор */
exports = module.exports = wmConstructor;
/* чтение данных из package.json*/
var packageInfo = require('./package.json');
exports.info = {
   name: packageInfo.name,
   version: packageInfo.version,
   versionName: packageInfo.versionName,
   author: packageInfo.author
};
delete packageInfo;
/* Конструктор объектов wm */
function wmConstructor(params){
   var wm = {};
   params = params || {};
   /* Каталог откуда запускается модуль */
   /* По факту это корень для расположения сайтов по умолчанию */
   /* Относительные пути будут искаться от этого каталога */
   wm.rootSites = path.normalize(path.dirname(module.parent.filename));
   /* Каталог модуля wm */
   wm.pathWM = path.normalize(path.dirname(module.filename));
   wm.pathWMinterface = path.join(wm.pathWM,'interface');
   /* Каталог сайта */
   if (typeof params.path !== 'string')
      console.error('Путь к сайту не задан!');
   wm.pathSite = path.normalize(params.path);
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
      params.port?params.port:
      localConfigs.port?localConfigs.port:
      defaultPort;
   wm.core = require('./lib/core.js');
   wm.parser = require('./ulib/parser.js');
   wm.parser.loder = require('./lib/parserLoder.js')(wm);
   wm.info = exports.info;
   wm.express = require('express');
   wm.app = wm.express();
   wm.core.start.call(wm);
   wm.app.listen(wm.port);
   console.log('Сайт: '+wm.pathSite);
   console.log('Тип сайта: '+wm.typeSite);
   console.log('Запущен на порту: '+wm.port);
   return wm;
}