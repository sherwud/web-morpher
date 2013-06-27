"use strict";
var path = require('path');
var fs = require('fs');
var root = path.dirname(module.filename);
function createAbstract(mod,modPath,modLogic){
   return Proxy.createFunction(
      {
         get: function(self, name){
            switch (name) {
               case 'isProxy': return true; break;
               case 'getThis': return mod; break;
            }
            var newModPath = modPath+'/'+name;
            var newModLogic = modLogic;
            if (!(name in mod)) {
               newModLogic += '/'+name;
               try {
                  mod[name] = exports(newModPath,newModLogic);
               } catch (e){
                  mod[name] = createAbstract({},newModPath,newModLogic);
                  wmlog(e);
               }
            }
            if (!mod[name].isProxy) {
               if (typeof mod[name] === 'function'
                  || typeof mod[name] === 'object'
                     && !(mod[name] instanceof Array)) {
                  newModLogic += '.'+name;
                  mod[name] = createAbstract(mod[name],newModPath,newModLogic);
               }
            }
            return mod[name];
         }
      },
      function(){
         try {
            if (typeof mod === 'function'){
               return mod.apply(this,arguments);
            } else {
               wmlog('"'+modPath+'" не является функцией');
            }
         } catch(e){
            wmlog('Ошибка выполнения "'+modPath+'"');
            wmlog(mod)
            wmlog(e);
            return undefined;
         }
      }
   );
}
exports = module.exports = function abstract(modPath,modLogic){
   var way = path.join(root,modPath);
   var mod = false;
   if (!modLogic) modLogic = modPath;
   function checkWay(e){
      if (e.code === 'MODULE_NOT_FOUND'){
         if (fs.existsSync(way) && fs.statSync(way).isDirectory()) mod = {};
         else wmlog(e);
      } else {
         wmlog(e);
      }
   }
   try { mod = require(modPath);}
   catch(e){
      try { mod = require(way);}
      catch(e){ checkWay(e); }
   }
   if (!mod) {
      wmlog('Модуль "'+modLogic+'" не найден');
      mod = {};
   }
   if (mod.isProxy) return mod;
   return createAbstract(mod,modPath,modLogic);
};