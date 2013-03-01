var $loder = exports = module.exports;
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var hash = crypto.createHash('sha256');
function getHash(data){
   hash.update(data,'utf8');
   return hash.digest('hex');
}
function readFile(file,callback){
   fs.stat(file,function(e,stats){
      if (!e && stats.isFile())
         fs.readFile(file,'utf8',function(e, data){
            if (!e){
               try {
                  callback(0,data);
               } catch(e){
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
   readFile(file,function(e,data){
      if (!e){
         try {
            /*для возможности хранения многострочного текста параметрах*/
            data = data.replace(/\\\n/g,'');
            var parse = JSON.parse(data);
         } catch(e){
            e = {e:e};
            e.metodmessage = 'ERROR: JSON.parse - '+file;
            callback('ERROR: JSON.parse - '+file);
            return;
         }
         callback(0,parse,cachePage);
      } else { callback(e); }
   });      
};
function mkdir(dir,callback){
   var parentDir = path.dirname(dir);
   fs.exists(parentDir,function(exists){
       if (exists){
          fs.mkdir(dir,function(e){
             if (!e){
                callback();
             } else {
                console.log(e);
             }
          });
       } else { mkdir(parentDir,callback); }
   });   
}
function writeFile(file,data){
   var dir = path.dirname(file);
   fs.exists(dir,function(exists){
      if (exists){
         fs.writeFile(file,data,'utf8',function(e){
            if (e) console.log(e);
         });
      } else { mkdir(dir,function(){writeFile(file,data);}); }
   });
}
/* Кеширует готовые html файлы
 * html - текст html файла
 * params - параметры файла
 */
$loder.cachePage = function(html,params){
   console.log(params.htmlFile);
   console.log(getHash(html));
   writeFile(params.htmlFile,html);
};
/* Проверяет актуальность кешированного файла
 * params - параметры файла
 */
$loder.checkCache = function(params){

};
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
   var htmlFile = file;
   if (httpMethod === 'get'){
      htmlFile = path.join(wm.pathSite,htmlFile);
   } else {
      htmlFile = path.join(wm.pathSite,'web-morpher','~cache',htmlFile);
   }
   var jsonFile = path.join(
      wm.pathSite,
      'web-morpher','pages',
      path.dirname(file),
      path.basename(file,path.extname(file))+'.json'
   );
   var cachePage = function(html){
      $loder.cachePage(html,{
         file:file,
         htmlFile:htmlFile,
         httpMethod:httpMethod
      });
   }
   readFile(htmlFile,function(e,data){
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