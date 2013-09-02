"use strict";
var wmpath = wm.path;
if ('siteroot' in wmpath)
   exports = module.exports = wmabstract(wmpath.siteroot+'/dynamic/modules');
else {
   exports = module.exports = {};
   wmlog('Свойство "siteroot" не найдено в объекте "wm.path"',
      {'title':'export modules'}
   );
}