"use strict";
var wmpath = wm.path;
if ('siteroot' in wmpath) {
   try{
      exports = module.exports =
         wmabstract(wmpath.siteroot+'/dynamic/modules',null,true);
   }catch(e){
      exports = module.exports = {};
      wmlog(e,{'title':'export modules'});
   }
} else {
   exports = module.exports = {};
   wmlog('Свойство "siteroot" не найдено в объекте "wm.path"',
      {'title':'export modules'}
   );
}