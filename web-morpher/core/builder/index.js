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
function deployResource(project,siteroot){
   if (fs.existsSync(project+'/resource')){
      wmutil.fsCopySync(project+'/resource','siteroot&?');
   }


   if (fs.existsSync(project+'/resource/dynamic')){
      if (!fs.existsSync(siteroot+'/dynamic'))
         fs.mkdirSync(siteroot+'/dynamic');
   }else{
      if (fs.existsSync(siteroot+'/dynamic'))
         wmlog('Удаление папки с подкаталогами!!!');//fs.rmdirSync(siteroot+'/dynamic');
   }
   if (fs.existsSync(project+'/resource/dynamic/modules')){
      if (!fs.existsSync(siteroot+'/dynamic/modules'))
         fs.mkdirSync(siteroot+'/dynamic/modules');
   }
   if (fs.existsSync(project+'/resource/static')){
      if (!fs.existsSync(siteroot+'/static'))
         fs.mkdirSync(siteroot+'/static');
   } else {
      if (fs.existsSync(siteroot+'/static'))
         wmlog('Удаление папки с подкаталогами!!!');//fs.rmdirSync(siteroot+'/static');
   }
   
}
exports.deploy = function(project,config){
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
   } else if (config.always_deploy) {
      deploy = true;
   }
   if (deploy) {
      createVerFile(siteroot);
      deployResource(project,siteroot);
      
      wmlog('deploy new',logprm);
   } else {
      wmlog('deploy ok',logprm);
   }
   
   wmlog(project);
   
};