"use strict";
var wmlog = global.wmlog.init({'title':'abstract'});
function createAbstract(mod,modPath,modLogic,critical){
   /*
    * Задача 1: Запретить set, убрать __getThis
    * Задача 2: Добавить свойство __isModule
    *    Указывает что объект взят из отдельного файла(модуля), а не добавлен кодом инициализции
    *    Если объект не является модулем ему не доступен __addModulePath
    */
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
            throw 'ERROR: operator "set" denied for "'
                     +modLogic + '.'+name + '"';
         },
         delete: function deleteAbstractProperty(name){
            throw 'ERROR: operator "delete" denied for "'
                     +modLogic + '.'+name + '"';
         },
         get: function getAbstractProperty(self, name){
            if (name in mod &&
                  ((typeof mod[name] !== 'object' || mod[name] instanceof Array)
                     && typeof mod[name] !== 'function'
                     || mod[name].__isProxy))
               return mod[name];
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
            if (mod[name]
                  && (typeof mod[name] === 'object'
                     && !(mod[name] instanceof Array)
                     || typeof mod[name] === 'function')
                  && !mod[name].__isProxy) {
               newModLogic += '.'+name;
               mod[name] =
                  createAbstract(mod[name],newModPath,newModLogic,critical);
            }
            return mod[name];
         }
      },
      function(){
         try {
            if (typeof mod === 'function'){
               return mod.apply(this,arguments);
            } else {
               wmlog(1,modPath);
               wmlog(1,
                  global.wmlog.stackTrace('"'+modLogic+'" не является функцией')
               );
            }
         } catch(e){
            wmlog(1,'Ошибка выполнения "'+modLogic+'"');
            wmlog(1,modPath);
            wmlog(1,mod);
            wmlog(1,e);
            return undefined;
         }
      }
   );
}
/* Задача 1: создавать абстрактный класс по массиву модулей с приоритетом как и по 1му модулю
 *    newObj = abstract(['путь к модулю 1','путь к модулю 2'])
 * Задача 2: добавление нового (более приоритетного) пути к уже созданному объекту. и 1 модуль и массив
 *    newObj.__addModulePath('путь к модулю 3')
 *    newObj.__addModulePath(['путь к модулю 4','путь к модулю 4'])
 * Подробно:
 *    При подключении по массиву берется инициализация из вышестояшего в массиве(приоритетного).
 *    При подключении файлов свойст объекта также берется логика приоритетного пути.
 *    Поиск идет по ниспадающей от более приоритетного к менее.
 *    Ошибки не игнорируются, если модуль упал, не ищется его аналог ниже.
 */
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
         wmlog(1,'Модуль "'+modLogic+'" не найден');
         global.wmlog([global_e,e],{'title':modPath,'code':1});
         mod = {};
      }
   }
   if ((typeof mod !== 'object' || mod instanceof Array)
         && typeof mod !== 'function'
         || mod.__isProxy)
      return mod;
   return createAbstract(mod,modPath,modLogic,critical);
};