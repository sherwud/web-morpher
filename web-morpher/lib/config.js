"use strict";
var fs = require('fs');
exports = module.exports = {};
var packageInfo = require('./package.json');
try{
   let config = require('./config.json');
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
   for(let i in config) exports[i] = config[i];
}catch(e){ console.log(e); }
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