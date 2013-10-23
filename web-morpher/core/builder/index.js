"use strict";
var fs = wm.ext.fs;
var path = wm.ext.path;
var util = wm.util;
var __builder = module.exports = {};
__builder.deploy = deploy;
function deploy(project,config,callback){
   var siteroot = config.siteroot;
   function  createVerFile(){
      var verFile = path.join(siteroot, 'ver.json');
      var ver = {};
      try { ver = require(verFile); }catch(e){}
      fs.writeFileSync(verFile,JSON.stringify({
         date: util.DateToString(),
         build: ver.build?(++ver.build):1,
         platform:wm.info()
      },null,'   '),'utf8');
   }
   function createConfigFile(){
      var configFile = path.join(siteroot, 'config.json');
      var config = {};
      try { config = require(configFile); }catch(e){}
      fs.writeFileSync(configFile,JSON.stringify({
         sessionSecret: config.sessionSecret || util.generateUUID()
      },null,'   '),'utf8');
   }
   function resourceDeploy(callback){
      var resource = path.join(project, 'resource');
      if (fs.existsSync(resource)){
         util.fsCopy(resource,siteroot,callback);
      } else {
         callback();
      }
   }
   var deploy = false;
   if (!fs.existsSync(siteroot)) {
      deploy = true;
      fs.mkdirSync(siteroot);
   } else if (!fs.existsSync(path.join(siteroot, 'ver.json'))) {
      deploy = true;
      util.fsClearSync(path.join(siteroot, 'dynamic'));
      util.fsClearSync(path.join(siteroot, 'static'));
   } else if (config.always_deploy) {
      deploy = true;
      util.fsClearSync(path.join(siteroot, 'dynamic'));
      util.fsClearSync(path.join(siteroot, 'static'));
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