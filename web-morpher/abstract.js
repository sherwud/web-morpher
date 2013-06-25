"use strict";
var path = require('path');
var fs = require('fs');
var root = path.dirname(module.filename);
function createAbstract(mod,modPath){
   return Proxy.createFunction(
      {
         get: function(self, name){
            switch (name) {
               case 'isProxy': return true; break;
               case 'getThis': return mod; break;
            }
            var newModPath = modPath+'/'+name;
            if (!(name in mod)) {
               try {
                  mod[name] = exports(newModPath);
               } catch (e){
                  mod[name] = createAbstract({},newModPath);
                  wmlog(e);
               }
            }
            if (!mod[name].isProxy) {
               if (typeof mod[name] === 'function'
                  || typeof mod[name] === 'object'
                     && !(mod[name] instanceof Array))
                  mod[name] = createAbstract(mod[name],newModPath);
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
      mod = {};
   }
   if (mod.isProxy) return mod;
   return createAbstract(mod,dir);
};