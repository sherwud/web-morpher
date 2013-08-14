var fs = wm.ext.fs;
var path = wm.ext.path;
exports = module.exports = {};
function  createVerFile(siteroot){
   fs.writeFileSync(siteroot+'/ver.json',JSON.stringify({
      date: wm.util.DateToString(),
      platform:wm.info()
   },null,'   '),'utf8');
}
function createDirectoryStructure(siteroot,config){
   if (config.dynamic) {
      if (!fs.existsSync(siteroot+'/dynamic'))
         fs.mkdirSync(siteroot+'/dynamic');
      if (!fs.existsSync(siteroot+'/dynamic/modules'))
         fs.mkdirSync(siteroot+'/dynamic/modules');
   } else {
      if (fs.existsSync(siteroot+'/dynamic'))
         fs.rmdirSync(siteroot+'/dynamic')
   }
   if (config.static) {
      if (!fs.existsSync(siteroot+'/static'))
         fs.mkdirSync(siteroot+'/static');
   } else {
      
   }
}
exports.deploy = function(way,config){
   var logprm = {'title':'function builder.deploy'};
   var siteroot = path.join(wm.path.startupdir,config.siteroot);
   if (!fs.existsSync(path.dirname(siteroot))) {
      wmlog('Каталог сайта '+path.dirname(siteroot),logprm);
      return;
   }
   var deploy = false;
   if (!fs.existsSync(siteroot)) {
      deploy = true;
      fs.mkdirSync(siteroot);
   } else if (!fs.existsSync(siteroot+'/ver.json')) {
      deploy = true;
   } else if (config.always_convert) {
      deploy = true;
   }
   if (deploy) {
      createVerFile(siteroot);
      createDirectoryStructure(siteroot,config)
      
      wmlog('deploy new',logprm);
   } else {
      wmlog('deploy ok',logprm);
   }
   
   wmlog(way);
   
};