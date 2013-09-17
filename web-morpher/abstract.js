"use strict";
var wmlog = global.wmlog.init({'title':'abstract'});
function createAbstract(mod,modPath,modLogic,critical){
   return Proxy.createFunction(
      {
         has: function hasAbstractProperty(name) {
            return name in mod;
         },
         enumerate: function enumerateAbstractProperty(){
            return Object.keys(mod);
         },
         keys: function keysAbstractProperty(){
            return Object.keys(mod);
         },
         set: function setAbstractProperty(self, name, val){
            mod[name]=val;
         },
         delete: function deleteAbstractProperty(name){
            delete mod[name];
         },
         get: function getAbstractProperty(self, name){
            if (name in mod && mod[name].__isProxy) return mod[name];
            if (name.substr(0,2) === '__') {
               switch (name) {
                  case '__isProxy': return true; break;
                  case '__getThis': return mod; break;
               }
            }
            var newModPath = modPath+'/'+name;
            var newModLogic = modLogic;
            if (!(name in mod)) {
               newModLogic += '/'+name;
               try {
                  mod[name] = exports(newModPath,newModLogic,critical);
               } catch (e){
                  if (critical) throw e;
                  mod[name] =
                     createAbstract({},newModPath,newModLogic,critical);
                  wmlog(1,e);
               }
            }
            if (mod[name] && !mod[name].__isProxy) {
               if (typeof mod[name] === 'function'
                  || typeof mod[name] === 'object'
                     && !(mod[name] instanceof Array)) {
                  newModLogic += '.'+name;
                  mod[name] =
                     createAbstract(mod[name],newModPath,newModLogic,critical);
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
               wmlog(1,'"'+modPath+'" не является функцией');
            }
         } catch(e){
            wmlog(1,'Ошибка выполнения "'+modPath+'"');
            wmlog(1,mod);
            wmlog(1,e);
            return undefined;
         }
      }
   );
}
exports = module.exports = function abstract(modPath,modLogic,critical){
   var mod = false;
   if (!modLogic) modLogic = modPath;
   function requirePath(way){
      try { mod = require(way); }
      catch(e){
         var fs = wm.ext.fs;
         if (e.code === 'MODULE_NOT_FOUND'){
            if (fs.existsSync(way) && fs.statSync(way).isDirectory()) mod = {};
            else throw e;
         } else throw e;
      }
   }
   function requireLocalPath(){
      var path = wm.ext.path;
      var way = path.join(path.dirname(module.filename),modPath);
      requirePath(way);
   }
   try { requirePath(modPath); }
   catch(global_e){
      try { requireLocalPath(); }
      catch(e){
         if (critical) throw [global_e,e];
         global.wmlog([global_e,e],{'title':modPath,'code':1});
         wmlog(1,'Модуль "'+modLogic+'" не найден');
         mod = {};
      }
   }
   if (mod.__isProxy) return mod;
   return createAbstract(mod,modPath,modLogic,critical);
};