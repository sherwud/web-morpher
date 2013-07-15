"use strict";
function createAbstract(mod,modPath,modLogic){
   return Proxy.createFunction(
      {
         get: function getAbstractProperty(self, name){
            if (name in mod) return mod[name];
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
            if (mod[name] && !mod[name].isProxy) {
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
      function callAbstract(){
         try {
            if (typeof mod === 'function'){
               return mod.apply(this,arguments);
            } else {
               wmlog('"'+modPath+'" не является функцией');
            }
         } catch(e){
            wmlog('Ошибка выполнения "'+modPath+'"');
            wmlog(mod);
            wmlog(e);
            return undefined;
         }
      }
   );
}
exports = module.exports = function abstract(modPath,modLogic){
   var mod = false;
   if (!modLogic) modLogic = modPath;
   function requireWay(){
      var path = wm.ext.path;
      var fs = wm.ext.fs;
      var root = path.dirname(module.filename);
      var way = path.join(root,modPath);
      try { mod = require(way); }
      catch(e){
         if (e.code === 'MODULE_NOT_FOUND'){
            if (fs.existsSync(way) && fs.statSync(way).isDirectory()) mod = {};
            else throw e;
         } else throw e;
      }
   }
   try { mod = require(modPath);}
   catch(global_e){
      try { requireWay(); }
      catch(e){
         wmlog(global_e,{'title':modPath});
         wmlog(e,{'title':modPath});
         wmlog('Модуль "'+modLogic+'" не найден');
         mod = {};
      }
   }
   if (mod.isProxy) return mod;
   return createAbstract(mod,modPath,modLogic);
};