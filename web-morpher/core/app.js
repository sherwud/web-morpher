"use strict";
var fs = wm.ext.fs;
var path = wm.ext.path;
/*
 * @info Выполняет запуск системы по переданным параметрам
 * @param {string} way - файл или каталог запуска
 * @returns undefined
 */
module.exports = function app(way,callback){
   var wmlog = global.wmlog.init({'title':'function app'});
   if (typeof way !== 'string' && way !== '') {
       wmlog(1,'Файл или каталог запуска не задан!');
       return;
   }
   if (way[0] === '.') {
      way = path.join(wm.path.startupdir,way);
   }
   if (!fs.existsSync(way)) {
       wmlog(1,'Файл или каталог запуска "'+way+'" не найден!');
       return;
   }
   var config;
   if (fs.statSync(way).isDirectory()) {
      config = way+'/config.json';
   } else {
      config = way;
      way = path.dirname(way);
   }
   try {
      config = require(config);
   } catch (e){
      wmlog(1,'Файл "'+config+'"!');
      wmlog(1,e);
      return;
   }
   var siteroot = path.join(wm.path.startupdir,config.siteroot);
   if (fs.existsSync(path.dirname(siteroot))) {
      config.siteroot = siteroot;
   }
   wm.builder.deploy(way,config,function(){
      global.wmlog.set_logFilesRoot(config.siteroot);
      wm.server.prepare(config).listen();
      if (typeof callback === 'function') callback();
   });
};