var fs = wm.ext.fs;
var path = wm.ext.path;
exports = module.exports = {};
exports.deploy = function(project,config,callback){
   var siteroot = config.siteroot;
   var wmutil = wm.util;
   function  createVerFile(){
      fs.writeFileSync(siteroot+'/ver.json',JSON.stringify({
         date: wmutil.DateToString(),
         platform:wm.info()
      },null,'   '),'utf8');
   }
   function resourceDeploy(callback){
      if (fs.existsSync(project+'/resource')){
         wmutil.fsCopy(project+'/resource',siteroot,callback);
      } else {
         callback();
      }
   }
   var deploy = false;
   if (!fs.existsSync(siteroot)) {
      deploy = true;
      fs.mkdirSync(siteroot);
   } else if (!fs.existsSync(siteroot+'/ver.json')) {
      deploy = true;
      wmutil.fsClearSync(siteroot);
   } else if (config.always_deploy) {
      deploy = true;
      wmutil.fsClearSync(siteroot);
   }
   if (deploy) {
      resourceDeploy(function(e){
         if (e) { throw e; }
         /* тут вызов конвертации source */
         createVerFile();
         callback();
      });
   } else {
      callback();
   }
};