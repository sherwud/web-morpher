"use strict";
var path = require('path');
var fs = require('fs');
var root = path.dirname(module.filename);
function abstractError(dir){
   var err = {
      isProxy : true,
      getThis : function(){return err;}
   }
   return Proxy.create({
      get: function(proxy, name){
         if (!(name in err)) {
            err[name] = abstractError(dir+'/'+name);
            wmlog('Модуль "'+dir+'/'+name+'" не найден');
         }
         return err[name];
      }
   });
}
function createProxy(mod,dir){
   return Proxy.create({
      get: function(proxy, name){
         if (!(name in mod)) {
            try {
               mod[name] = exports(dir+'/'+name);
            } catch (e){
               wmlog(e);
            }
         }
         if (typeof mod[name] === 'function')
            return createProxyFunc(mod[name],dir+'/'+name);
         return mod[name];
      }
   });
}
function createProxyFunc(mod,dir){
   return function(){
      try {
         return mod.apply(this,arguments);
      } catch(e){
         wmlog('Ошибка выполнения "'+dir+'"');
         wmlog(e);
         return undefined;
      }
   };
}
exports = module.exports = function(dir){
   var way = path.join(root,dir);
   var mod = false;
   function checkWay(e){
      if (e.code === 'MODULE_NOT_FOUND'){
         if (fs.existsSync(way) && fs.statSync(way).isDirectory()) mod = {};
         else wmlog(e);
      } else {
         wmlog(e);
      }
   }
   try { mod = require(dir);}
   catch(e){
      try { mod = require(way);}
      catch(e){ checkWay(e); }
   }
   if (!mod) {
      wmlog('Модуль "'+dir+'" не найден');
      return abstractError(dir);
   }
   if (typeof mod === 'function') return createProxyFunc(mod,dir);
   if (mod.isProxy) return mod;
   mod.isProxy = true;
   mod.getThis = function(){return mod;};
   return createProxy(mod,dir);
};