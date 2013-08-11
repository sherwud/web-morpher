var fs = wm.ext.fs;
var path = wm.ext.path;
exports = module.exports = {};
function  createVerFile(siteroot){
   wmlog({
      data: wm.util.DateToString(),
      platform:wm.info()
   });
}
exports.deploy = function(config){
   var logprm = {'title':'function builder.deploy'};
   var siteroot = path.join(wm.path.startupdir,config.siteroot);
   if (!fs.existsSync(path.dirname(siteroot))) {
      wmlog('Каталог сайта '+path.dirname(siteroot),logprm);
      return;
   }
   var newsite = false;
   if (!fs.existsSync(siteroot)) {
      newsite = true;
      fs.mkdirSync(siteroot);
      createVerFile(siteroot);
   } else if (!fs.existsSync(siteroot+'/ver.json')) {
      createVerFile(siteroot);
   }
   
   wmlog('ok',logprm);
   wmlog(path.dirname(siteroot),logprm);
};