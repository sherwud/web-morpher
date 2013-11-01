"use strict";
var args = {};
for (var i in global.process.argv) {
   if (~global.process.argv[i].search(/^--/)) {
      var val = global.process.argv[i].replace(/--/, '').split(':');
      args[val[0]] = val[1];
   }
}
require('./web-morpher');
//wmlog(wm.info(),{title:'О системе',code:2});
wm.app(args.path, function() {
   wmlog('well done!', {code: 0});
});