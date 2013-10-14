"use strict";
exports = module.exports = function(server){
   var modules = wm.modules;
   server.app.get('/*',function (req, res, next){
      if (req.query.url) {
         modules.httpproxy.proxyServerHandler(req, res);
      } else {
         next();
      }
   });
};