"use strict";
try{
   module.exports =
      wmabstract(wm.server.config.siteroot+'/dynamic/modules',null,true);
}catch(e){
   module.exports = {};
   wmlog(e,{'title':'export modules','code':1});
}