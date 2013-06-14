"use strict";
var path = require('path');
var fs = require('fs');
var root = path.dirname(module.filename);
global.wm = abstract('./core',function(name){
   return abstract('./core/'+name);
});
global.abstract = abstract;
function abstract(dir,loader){
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
   //console.log(dir);
   //console.log(mod);
   //return mod;
   if (typeof mod === 'function') return function(){
      try {
         return mod.apply(this,arguments);
      } catch(e){
         log(e);
         return undefined;
      }
   };
   mod.isProxy = true;
   mod.getThis = function(){return mod;};
   return Proxy.create({
      get: function(proxy, name){
         if (!(name in mod)) {
            try {
               mod[name] = loader(name);
            } catch (e){
               log(e);
            }
         }
         return mod[name];
      }
   });
}
function log(e,caller){
   if (e.isProxy) e = e.getThis();
   console.log('Error '+caller+': '+e)/*
   if (wm && wm.log) wm.log(e);
   else {
      try {
         console.log(e);
      }catch (e){
         
      }
      
   }*/
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