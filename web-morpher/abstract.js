"use strict";
function createAbstract(mod,modPath,modLogic){
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
         set: function setAbstractProperty(){
            throw 'Нельзя модифицировать абстрактный класс "'+modLogic+'"!';
         },
         delete: function deleteAbstractProperty(){
            throw 'Нельзя модифицировать абстрактный класс "'+modLogic+'"!'
         },
         get: function getAbstractProperty(self, name){
            if (name in mod && mod[name].__isProxy) return mod[name];
            if (name.substr(0,2) === '__') {
               switch (name) {
                  case '__isProxy': return true; break;
                  case '__getThis': return mod; break;
                  case '__initProperty':
                     return function initProperty(name,val){
                        if (!(name in mod)) {
                        mod[name]=val;
                        } else {
                           wmlog(modLogic);
                           wmlog('Свойство "'+name+'" уже инициализировано',{
                              'title':'function initProperty'
                           });
                        }
                     };
                     break;
               }
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
            if (mod[name] && !mod[name].__isProxy) {
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
         wmlog([global_e,e],{'title':modPath});
         wmlog('Модуль "'+modLogic+'" не найден');
         mod = {};
      }
   }
   if (mod.__isProxy) return mod;
   return createAbstract(mod,modPath,modLogic);
};