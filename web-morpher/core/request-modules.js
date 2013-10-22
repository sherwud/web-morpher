"use strict";
var fs = wm.ext.fs;
if (fs.existsSync(wm.server.config.siteroot+'/dynamic/request-modules')) {
   try{
      module.exports =
         wmabstract(wm.server.config.siteroot+'/dynamic/request-modules',null,true);
   }catch(e){
      module.exports = {};
      wmlog(e,{'title':'export modules','code':1});
   }
} else {
   module.exports = false;
}