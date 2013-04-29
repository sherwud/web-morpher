var path = require('path');
var fs = require('fs');
exports = module.exports = {};
var packageInfo = require('./package.json');
var glConf = require('./config.json');
var temp = glConf['node_modules_root'];
temp = String(temp);
if (!fs.existsSync(temp)) temp = '';
glConf['node_modules_root'] = temp;
temp = glConf['node_modules'];
if (typeof temp !== 'object' || temp instanceof Array) {
   delete temp;
   glConf['node_modules'] = {};
} else {
   for (var i in temp) {
      if (!fs.existsSync(temp[i])) delete temp[i];
   }
   delete temp;
}
var findNodeModule = function(name){
   var temp = glConf['node_modules'][name];
   if (temp) return temp;
   else {
      return path.join(glConf['node_modules_root'],name);
   }
};
var glPath = {};
/* путь к модулю wm */
glPath.wmroot = path.dirname(path.normalize(module.filename));
/* путь к обязательным модулям */
glPath.wmlib = path.join(glPath.wmroot,'lib');
/* путь к необязательным модулям */
glPath.wmmod = path.join(glPath.wmroot,'modules');
/* путь к модулям общим с интерфейсом */
glPath.wmulib = path.join(glPath.wmroot,'ulib');
/* путь к интерфейсу */
glPath.wi = path.join(glPath.wmroot,'wi');
/* путь к стандартным интерфейсам */
glPath.wires = path.join(glPath.wi,'res');
/* путь к модулям интерфейса */
glPath.wilib = path.join(glPath.wi,'lib');
/* путь к расширениям интерфеса */
glPath.wiext = path.join(glPath.wi,'ext');
/* путь к каталогу запуска */
glPath.startup = path.dirname(path.normalize(module.parent.filename));
/* путь к корню */
glPath.root = path.dirname(glPath.wmroot);
/* подключаем внешние модули */
var formidable = require(findNodeModule('formidable'));
var express = require(findNodeModule('express'));
/* подключаем модули wm*/
var core = require('./lib/core.js');
//var parser = require('./ulib/parser.js');
//var parserLoder = require('./lib/parserLoder.js');
/*
 * @info Получение общей информации о системе
 * @param {string} name - имя параметра для получения
 * @returns {any} - значение параметра, или стандартный набор
 */
exports.info = function(name){
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
/*
 * @info Создает объект для сайта
 * @param {string} sitePath - путь к сайту
 * @returns {object} - объект для управления сайтом
 */
exports.app = wmConstructor;
function wmConstructor(sitePath){
   if (!(this instanceof wmConstructor)) {return new wmConstructor(sitePath);}
   if (typeof sitePath === 'string') 
      sitePath = path.normalize(sitePath);
   else {
      console.log('Путь к сайту не задан');
      return;
   }
   var serv = {path:{}};
   /* инфо о сервере */
   serv.info = exports.info;
   /* путь к сайту */
   serv.path.site = path.join(glPath.startup,sitePath);
   if (!fs.existsSync(serv.path.site)) {
      serv.path.site = path.join(glPath.root,sitePath);
      if (!fs.existsSync(serv.path.site)) {
         serv.path.site = sitePath;
         if (!fs.existsSync(serv.path.site)) {
            console.log('Неверный путь к сайту: "'+serv.path.site+'"');
            return false;
         }
      }
   }
   /* путь к ресурсам сайта */
   serv.path.sitewm = path.join(serv.path.site,'wm');
   serv.path.sitepages = path.join(serv.path.site,'pages');
   /* пути от wm */
   serv.glPath = glPath;
   /* настройки сайта */
   var siteConf = path.join(serv.path.sitewm,'config.json');
   if (fs.existsSync(serv.path.sitewm)) {
      if (fs.existsSync(siteConf)) {
         try { siteConf = require(siteConf)||{}; }
         catch(e) { console.error(e); siteConf = {}; }
      } else { siteConf = {}; }
   } else { serv.path.sitewm = false; siteConf = {}; }
   /* порт для сайта */
   serv.port = siteConf.port;
   /* настройки сайта */
   serv.conf = {};
   /* показывать инфо о системе */
   serv.conf.showInfo = typeof siteConf['showInfo'] === 'boolean' ?
      siteConf['showInfo']:true;
   /* ссылки на модули */
   serv.express = express;
   serv.formidable = formidable;
   /* добавляем приложение express */
   serv.app = express();
   /* добавляем экземпляр сервера wm */
   serv.core = core(serv);
   /* функции управления сервером */
   /*
    * @info Запускает сервер
    * @param {string} sitePort - порт на котором запускать сайт
    */
   this.listen = function(sitePort){
      if (typeof sitePort === 'number') {
         sitePort = sitePort ^ 0;
         serv.port = sitePort;
      }
      if (!serv.port) {
         console.log('Не задан порт для сайта: "'+serv.path.site+'"');
         return;
      }
      serv.app.listen(serv.port);
      console.log('Сайт: '+serv.path.site);
      console.log('Запущен на порту: '+serv.port);
   };
}