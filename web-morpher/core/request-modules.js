"use strict";
var fs = wm.ext.fs;
if (fs.existsSync(wm.server.config.siteroot+'/dynamic/request-modules')) {
   try{
      exports = module.exports =
         wmabstract(wm.server.config.siteroot+'/dynamic/request-modules',null,true);
   }catch(e){
      exports = module.exports = {};
      wmlog(e,{'title':'export modules','code':1});
   }
} else {
   exports = module.exports = false;
}