"use strict";
exports = module.exports = function(wm){
    wm.selflog = function(){
      wm.log(wm);
   };
   return Proxy.create({
      get: function(proxy, name){
         if (!(name in wm)) {
            try {
               wm[name] = require('./'+name);
            } catch (e){
               wm.log(e);
            }
         }
         return wm[name];
      }
   });
};