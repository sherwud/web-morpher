"use strict";
try{
   exports = module.exports =
      wmabstract(wm.server.config.siteroot+'/dynamic/modules',null,true);
}catch(e){
   exports = module.exports = {};
   wmlog(e,{'title':'export modules'});
}