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
/* Читает файл страцы из json, или из html, если страница кеширована
* file - путь к странице
* callback - функция для передачи результатов
* callback(e,data)
* e - ошибка, 0 если нет ошибки
* data - данные для отправки
*/
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
/* Читает шаблон 
* params - параметры для шаблона из страницы
* callback - функция для передачи результатов
*/
$loder.getTemplate = function(params,callback){
   
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
