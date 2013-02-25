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
function readJSON(file,callback){
   readFile(file,function(e, data){
      if (!e){
         try {
            /*для возможности хранения многострочного текста параметрах*/
            data = data.replace(/\\\n/g,'');
            callback(0,JSON.parse(data));
         }
         catch (e){ callback('ERROR: JSON.parse - '+file,{}); }
      } else { callback(e); }
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
   readFile(htmlFile,function(e, data){
      if (!e){
         /* добавить сравнение хеша из JSON и хранилища хешей страниц */
         callback(0,data);
      } else {
         readJSON(jsonFile,callback);
      }
   });
};
/* Читает шаблон 
* params - параметры для шаблона из страницы
* callback - функция для передачи результатов
*/
$loder.getTemplate = function(params,callback){
   var wm = this;
   var htmlFile = path.join(
      wm.rootSites,
      'web-morpher','interface','~cache','templates'
      ,params.name+'.html'
   );
   var jsonFile = path.join(
      wm.rootSites,
      'web-morpher','interface','templates'
      ,params.name+'.json'
   );
   readFile(htmlFile,function(e, data){
      if (!e){
         /* добавить сравнение хеша из JSON и хранилища хешей страниц */
         callback(0,data);
      } else {
         readJSON(jsonFile,callback);
      }
   });
};