"use strict";
var path = require('path');
var fs = require('fs');
var packageInfo = require('./package.json');
global.wm = {};
wm.path = {};
wm.path.wmroot = path.dirname(path.normalize(module.filename));
wm.path.siteroot = path.dirname(path.normalize(module.parent.filename));
try{
   let config = wm.config = require('./config.json');
   let tmp = String(config['modules_root']);
   if (!fs.existsSync(tmp)) tmp = '';
   config['modules_root'] = tmp;
   tmp = config['modules'];
   if (typeof tmp !== 'object' || tmp instanceof Array) {
      config['modules'] = {};
   } else {
      for (var i in tmp) {
         if (!fs.existsSync(tmp[i])) delete tmp[i];
      }
   }
}catch(e){
   console.log(e);
   wm.config = {};
}

require('./lib');
/*
* @info Получение общей информации о системе
* @param {string} name - имя параметра для получения
* @returns {any} - значение параметра, или стандартный набор
*/
wm.info = function(name){
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
 * @info Выполняет запуск системы по переданным параметрам
 * @param {string/object} param - параметры запуска
 * @returns {object} - объект для управления системой
 */
wm.app = function (param){
   console.log(wm);
   
};
