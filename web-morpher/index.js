var path = require('path');
var fs = require('fs');
var packageInfo = require('./package.json');
/* @info Получение общей информации о системе
 * @param {string} name - имя параметра для получения
 * @returns {any} - значение параметра, или стандартный набор
 */
this.info = function(name){
   if (name) {
      return packageInfo[name]?packageInfo[name]:null;
   } else {
      return {
         name: packageInfo.name,
         version: packageInfo.version,
         versionName: packageInfo.versionName,
         author: packageInfo.author
      };
   }
};
/* @info Создает объект для сайта
 * @param {string} sitePath - путь к сайту
 * @returns {object} - объект для управления сайтом
 */
this.app = wmConstructor;
function wmConstructor(sitePath){
   if (!(this instanceof wmConstructor)) {return new wmConstructor(sitePath);}
   if (typeof sitePath === 'string') 
      sitePath = path.normalize(sitePath);
   else {
      console.log('Путь к сайту не задан');
      return;
   }
   var wm = this;
   wm.path = {};
   

   
   /* путь к модулю wm */
   wm.path.wmroot = path.dirname(path.normalize(module.filename));
   /* путь к стандартным интерфейсам */
   wm.path.wmui = path.join(wm.path.wmroot,'ui');
   /* путь к каталогу запуска */
   wm.path.startup = path.dirname(path.normalize(module.parent.filename));
   /* путь к корню */
   wm.path.root = path.dirname(wm.path.wmroot);
   /* путь к сайту */
   wm.path.site = path.join(wm.path.startup,sitePath);
   if (!fs.existsSync(wm.path.site)) {
      wm.path.site = path.join(wm.path.root,sitePath);
      if (!fs.existsSync(wm.path.site)) {
         wm.path.site = sitePath;
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
   /*
   wm.test = require('./modules/standart.js');
   wm.test.tt();*/
   /* task #3 in process */
   console.log(wm);
   console.log(siteconfig);
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
   wm.listen = function(sitePort){
      if (typeof sitePort === 'number')
         sitePort = sitePort ^ 0;
   };
   wm.port = sitePort?sitePort:localConfigs.port;
   if (!wm.port)
      { console.log('Параметр "port" не задан'); return; }
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
}