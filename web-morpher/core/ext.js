"use strict";
var system_modules = ['path','fs'];
var mod ={};
exports = module.exports = Proxy.createFunction(
   {
      get: function getExtAbstractProperty(self, name){
         if (name in mod) return mod[name];
         switch (name) {
            case '__isProxy': return true; break;
            case '__getThis': return mod; break;
         }
         if (!(name in mod)) {
            try {
               if (system_modules.indexOf(name) !== -1)
                  throw 'getExtAbstractProperty require system_modules';
               if (wm.config.node_modules)
                  mod[name] = require(wm.ext.path.join(wm.config.node_modules,name));
               else
                  throw 'Параметр "node_modules" не задан в "config.json"';
            } catch (global_e){
               try {
                  mod[name] = require(name);
               } catch (e){
                  wmlog(global_e);
                  wmlog(e);
                  mod[name] = undefined;
               }
            }
         }
         return mod[name];
      }
   },
   function callExtAbstract(){
      wmlog('".core/ext" не является функцией');
   }
);