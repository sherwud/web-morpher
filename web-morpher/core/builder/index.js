var fs = wm.ext.fs;
var path = wm.ext.path;
var wmutil = wm.util;
exports = module.exports = {};
function  createVerFile(siteroot){
   fs.writeFileSync(siteroot+'/ver.json',JSON.stringify({
      date: wmutil.DateToString(),
      platform:wm.info()
   },null,'   '),'utf8');
}
exports.deploy = function(project,config,callback){
   var logprm = {'title':'function builder.deploy'};
   var siteroot = config.siteroot;
   function resourceDeploy(callback){
      if (fs.existsSync(project+'/resource')){
         wmutil.fsCopy(project+'/resource',siteroot,callback);
      } else {
         callback();
      }
   }
   if (!fs.existsSync(path.dirname(siteroot))) {
      wmlog('Каталог сайта "'+path.dirname(siteroot)+'" не найден!',logprm);
      return;
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
      resourceDeploy(function(){
         /* тут вызов конвертации source */
         createVerFile(siteroot);
         callback();
      });
   } else {
      callback();
   }
};