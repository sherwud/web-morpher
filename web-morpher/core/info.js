"use strict";
var packageInfo = require('../package.json');
/*
* @info Получение общей информации о системе
* @param {string} name - имя параметра для получения
* @returns {any} - значение параметра, или стандартный набор
*/
module.exports = function info(name){
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