"use strict";
var args = {};
for (var i in global.process.argv) {
   if (global.process.argv[i].search(/^--/) !== -1) {
      var val = global.process.argv[i].replace(/--/,'').split(':');
      args[val[0]]=val[1];
   }
}
require('./web-morpher');
wmlog(wm.config.info(),{title:'О системе',type:2});
wmlog(wm.path,{title:'Пути',type:2});
wmlog(wm.app(args.path));
wmlog('well done!',{type:0});
