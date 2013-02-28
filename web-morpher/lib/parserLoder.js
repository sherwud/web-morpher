var $loder = exports = module.exports;
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
function readFile(file,callback){
   fs.stat(file, function(e, stats){
      if (!e && stats.isFile())
         fs.readFile(file,'utf8', function (e, data) {
            if (!e){
               try {
                  callback(0,data);
               } catch (e){
                  callback(e);
                  console.log(e);
               }
            } else { callback(e); }
         });
      else {
         e = e || {text:file+' не является файлом'};
         e.HTTPCODE = 404;
         callback(e);
      }
   });
};
function readJSON(file,callback,cachePage){
   readFile(file,function(e, data){
      if (!e){
         try {
            /*для возможности хранения многострочного текста параметрах*/
            data = data.replace(/\\\n/g,'');
            var parse = JSON.parse(data); 
         } catch (e){
            e = {e:e};
            e.metodmessage = 'ERROR: JSON.parse - '+file;
            callback('ERROR: JSON.parse - '+file);
            return;
         }
         callback(0,parse,cachePage);
      } else { callback(e); }
   });      
};
/* Кеширует готовые html файлы
 * html - текст html файла
 * type - тип html файла
 *    get - готовый файл с вставкой шаблона
 *    post - страница без шаблона
 * params - параметры файла
 */
$loder.cachePage = function(html,params){
   var checksum = crypto.createHash('sha256');
   checksum.update(html,'utf8');
   var htmlsum = checksum.digest('hex');
   console.log(htmlsum);
   console.log(params);
   console.log(html);
}
/* Проверяет актуальность кешированного файла
 * params - параметры файла
 */
$loder.checkCache = function(params){
   
}
/* Читает файл страцы из json, или из html, если страница кеширована
* file - путь к странице
* httpMethod - метод с помощью которого запрошена страница (get/post)
* callback - функция для передачи результатов
* callback(e,data)
* e - ошибка, 0 если нет ошибки
* data - данные для отправки
*/
$loder.getPage = function(file,httpMethod,callback){
   var wm = this;
   var htmlFile = path.join(wm.pathSite,file);
   var jsonFile = path.join(
      wm.pathSite,
      'web-morpher','pages',
      path.dirname(file),
      path.basename(file,path.extname(file))+'.json'
   );
   var cachePage = function(html){
      $loder.cachePage(html,{
         file:file,
         httpMethod:httpMethod
      });
   }
   readFile(htmlFile,function(e, data){
      if (!e){
         /* добавить сравнение хеша из JSON и хранилища хешей страниц */
         callback(0,data);
      } else {
         readJSON(jsonFile,callback,cachePage);
      }
   });
};
/* Читает шаблон 
* params - параметры для шаблона из страницы
* callback - функция для передачи результатов
*/
$loder.getTemplate = function(params,callback){
   var wm = this;
   var jsonFile = path.join(
      wm.rootSites,
      'web-morpher','interface','templates'
      ,params.name+'.json'
   );
   readJSON(jsonFile,callback);
};