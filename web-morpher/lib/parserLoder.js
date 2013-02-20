var $loder = exports = module.exports;
var fs = require('fs');
var path = require('path');
function readFile(file,callback){
   fs.stat(file, function(e, stats){
      if (!e && stats.isFile())
         fs.readFile(file,'utf-8', function (e, data) {
            if (!e){ callback(0,data); } else { callback(e); }
         });
      else {
         e = e || {text:file+' не является файлом'};
         e.HTTPCODE = 404;
         callback(e);
      }
   });
};
$loder.getPage = function(file,callback){
   var wm = this;
   var htmlFile = path.join(wm.pathSite,file);
   var jsonFile = path.join(
      wm.pathSite,
      'web-morpher','pages',
      path.dirname(file),
      path.basename(file,path.extname(file))+'.json'
   );
   var readJSON = function(){
      readFile(jsonFile,function(e, data){
         if (!e){
            try { callback(0,JSON.parse(data)); }
            catch (e){ callback('ERROR: JSON.parse',{}); }
         } else { callback(e); }
      });      
   };
   readFile(htmlFile,function(e, data){
      if (!e){
         /* добавить сравнение хеша из JSON и хранилища хешей страниц  */
         callback(0,data);
      } else {
         readJSON();
      }
   });
   
};
/* > - */
$loder.getJSON = function(name,callback){
   /* добавить типы и загрузку из контролов и страниц */
   var fName = path.join(__dirname,'../ui/controls/',
      path.normalize(name)+'.json');
   fs.stat(fName, function(err, stats){
      if (!err && stats.isFile()){
         fs.readFile(fName,'utf-8', function (err, data) {
            if (!err){
               try {
                  data = JSON.parse(data);
               } catch (e){
                  data = {};
               }
               callback(data);
            } else {
               callback({});
            }
          });
      } else {
         callback({});
      }
   });
};
