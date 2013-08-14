var fs = wm.ext.fs;
var path = wm.ext.path;
exports = module.exports = {};
function  createVerFile(siteroot){
   fs.writeFileSync(siteroot+'/ver.json',JSON.stringify({
      date: wm.util.DateToString(),
      platform:wm.info()
   },null,'   '),'utf8');
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
      
      wmlog('deploy new',logprm);
   } else {
      wmlog('deploy ok',logprm);
   }
   
   wmlog(way);
   
};