"use strict";
var path = require('path');
var fs = require('fs');
var root = path.dirname(module.filename);
global.wm = abstract('./lib');
global.abstract = abstract;
function abstract(dir){
   var way = path.join(root,dir);
   var mod = false;
   function checkWay(e){
      if (e.code === 'MODULE_NOT_FOUND'){
         if (fs.existsSync(way) && fs.statSync(way).isDirectory()) mod = {};
         else log(e);
      } else {
         log(e);
      }
   }
   try { mod = require(dir);}
   catch(e){
      try { mod = require(way);}
      catch(e){ checkWay(e); }
   }
   console.log(mod);
   return mod;
   /*
   if (typeof mod === 'function') return mod;
   return Proxy.create({
      get: function(proxy, name){
         if (!(name in mod)) {
            try {
               let newDir = dir+'/'+name;
               console.log(newDir);
               mod[name] = abstract(newDir);
            } catch (e){
               log(e);
            }
         }
         return mod[name];
      }
   });
   */
}
function log(e){
   if (wm && wm.log) wm.log(e);
   else {
      try {
         console.log(e);
      }catch (e){
         
      }
      
   }
}

/*
global.wm = require('./lib')({
   config: require('./config.js'),
   log: require('./log.js'),
   app: app
});
*/
/*
 * @info Выполняет запуск системы по переданным параметрам
 * @param {string/object} param - параметры запуска
 * @returns {object} - объект для управления системой
 */
/*
function app(param){
   wm.path;
   wm.selflog();
};
*/