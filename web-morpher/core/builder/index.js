"use strict";
var fs = wm.ext.fs;
var path = wm.ext.path;
var util = wm.util;
var __builder = module.exports = {};
__builder.deploy = deploy;
function deploy(project, config, callback) {
   var siteroot = config.siteroot;
   function  createVerFile() {
      var verFile = path.join(siteroot, 'ver.json');
      var ver = {};
      try {
         ver = require(verFile);
      } catch (e) {
      }
      fs.writeFileSync(verFile, JSON.stringify({
         date: util.DateToString(),
         build: ver.build ? (++ver.build) : 1,
         platform: wm.info()
      }, null, '   '), 'utf8');
   }
   function createConfigFile() {
      var configFile = path.join(siteroot, 'config.json');
      var config = {};
      try {
         config = require(configFile);
      } catch (e) {
      }
      fs.writeFileSync(configFile, JSON.stringify({
         sessionSecret: config.sessionSecret || util.generateUUID()
      }, null, '   '), 'utf8');
   }
   function resourceDeploy(callback) {
      function coreDeploy() {
         var coredir = config.wmcoredir;
         if (!coredir) {
            return callback();
         }
         var staticdir = path.join(siteroot, 'static');
         if (!fs.existsSync(staticdir)) {
            fs.mkdirSync(staticdir);
         }
         coredir = path.join(staticdir, coredir);
         var shared = path.join(wm.path.wmroot, 'front-end', 'shared');
         util.fsCopy(shared, coredir, callback);
      }
      var resource = path.join(project, 'resource');
      if (fs.existsSync(resource)) {
         util.fsCopy(resource, siteroot, coreDeploy);
      } else {
         callback();
      }
   }
   function resourceClear() {
      var dir = path.join(siteroot, 'dynamic');
      if (fs.existsSync(dir)) {
         util.fsClearSync(path.join(dir));
      }
      dir = path.join(siteroot, 'static');
      if (fs.existsSync(dir)) {
         util.fsClearSync(dir);
      }
   }
   var deploy = false;
   if (!fs.existsSync(siteroot)) {
      deploy = true;
      fs.mkdirSync(siteroot);
   } else if (!fs.existsSync(path.join(siteroot, 'ver.json'))) {
      deploy = true;
      resourceClear();
   } else if (config.always_deploy) {
      deploy = true;
      resourceClear();
   }
   if (deploy) {
      resourceDeploy(function(e) {
         if (e) {
            throw e;
         }
         /* тут вызов конвертации source */
         createVerFile();
         createConfigFile();
         callback();
      });
   } else {
      callback();
   }
}