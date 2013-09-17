"use strict";
var fs = wm.ext.fs;
var path = wm.ext.path;
var configs = ['node_modules'];
var check = {
   'node_modules':function(val){
      var wmpath = wm.path.wm;
      val = String(val);
      if (!fs.existsSync(val))
         if (fs.existsSync(path.join(wmpath,val)))
            val = path.join(wmpath,val);
         else
            return undefined;
      return val;
   }
};
var wmlog = global.wmlog.init({'title':'wm.config'});
try{
   exports = module.exports = new config;
}catch(e){
   exports = module.exports = {};
   wmlog(1,e);
}
function config(){
   var config = require('../config.json')[global.process.platform];
   var configAll = require('../config.json')['all'];
   if (typeof config !== 'object' && configAll !== 'object')
      throw 'Настройки для платформы '+global.process.platform+' не найдены';
   config = config || configAll;
   for (var i in configs) {
      var cfn = configs[i];
      if (typeof check[cfn] === 'function') {
         config[cfn] = check[cfn](config[cfn]);
         if (typeof config[cfn] === 'undefined')
            config[cfn] = check[cfn](configAll[cfn]);
      } else
         if (typeof config[cfn] === 'undefined')
            config[cfn] = configAll[cfn];
   }
   for(var i in config) this[i] = config[i];
}