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
   params = params || {};
   if (typeof params.path !== 'string')
      { console.log('Неверный параметр "path"'); return; }
   if (params.port && typeof params.port !== 'number')
      { console.log('Неверный параметр "port"'); return; }
   params.path = path.normalize(params.path);
   params.port = params.port ^ 0;
   var wm = {path:{}};
   /* путь к модулю wm */
   wm.path.wmroot = path.dirname(path.normalize(module.filename));
   /* путь к стандартным интерфейсам */
   wm.path.wmui = path.join(wm.path.wmroot,'ui');
   /* путь к каталогу запуска */
   wm.path.startup = path.dirname(path.normalize(module.parent.filename));
   /* путь к корню */
   wm.path.root = path.dirname(wm.path.wmroot);
   /* путь к сайту */
   wm.path.site = path.join(wm.path.startup,params.path);
   if (!fs.existsSync(wm.path.site)) {
      wm.path.site = path.join(wm.path.root,params.path);
      if (!fs.existsSync(wm.path.site)) {
         wm.path.site = params.path;
         if (!fs.existsSync(wm.path.site)) {
            console.log('Неверный путь к сайту: "'+wm.path.site+'"');
            return false;
         }
      }
   }
   /* путь к ресурсам сайта */
   wm.path.sitewm = path.join(wm.path.site,'wm');
   /* разбор структуры */
   var siteconfig = path.join(wm.path.sitewm,'config.json');
   if (fs.existsSync(wm.path.sitewm)) {
      if (fs.existsSync(siteconfig)) {
         try { siteconfig = require(siteconfig)||{}; }
         catch(e) { console.error(e); siteconfig = {}; }
      } else { siteconfig = {}; }
   } else { wm.path.sitewm = false; siteconfig = {}; }
   
   wm.test = require('./modules/standart.js');
   wm.test.tt();
   /* task #3 in process */
   //console.log(wm.test);
   //console.log(siteconfig);
   return;



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
   wm.formidable = require('formidable');
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