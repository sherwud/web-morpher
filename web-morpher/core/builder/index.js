"use strict";
var fs = wm.ext.fs;
var path = wm.ext.path;
var util = wm.util;
var __builder = module.exports = {};
__builder.deploy = deploy;
function deploy(project,config,callback){
   var siteroot = config.siteroot;
   function  createVerFile(){
      fs.writeFileSync(siteroot+'/ver.json',JSON.stringify({
         date: util.DateToString(),
         platform:wm.info()
      },null,'   '),'utf8');
   }
   function createConfigFile(){
      fs.writeFileSync(siteroot+'/config.json',JSON.stringify({
         sessionSecret: util.generateUUID()
      },null,'   '),'utf8');
   }
   function resourceDeploy(callback){
      if (fs.existsSync(project+'/resource')){
         util.fsCopy(project+'/resource',siteroot,callback);
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
      util.fsClearSync(siteroot);
   } else if (config.always_deploy) {
      deploy = true;
      util.fsClearSync(siteroot);
   }
   if (deploy) {
      resourceDeploy(function(e){
         if (e) { throw e; }
         /* тут вызов конвертации source */
         createVerFile();
         createConfigFile();
         callback();
      });
   } else {
      callback();
   }
};