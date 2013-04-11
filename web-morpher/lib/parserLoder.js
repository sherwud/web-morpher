exports = module.exports = wmParserLoderConstructor;
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var cache = {};
function getHash(data){
   var hash = crypto.createHash('sha256');
   hash.update(data,'utf8');
   return hash.digest('hex');
}
function checkFile(file,callback){
   fs.stat(file,function(e,stats){
      if (!e && stats.isFile())
         callback(0);
      else callback(e||{error:'File not found!'});
   });
};
function readFile(file,callback){
   checkFile(file,function(e){
      if (e) {
         e.HTTPCODE = 404;
         callback(e);
      } else {
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
      }
   });
};
function parseJSON(data,callback){
   try {
      /*для возможности хранения многострочного текста параметрах*/
      data = data.replace(/\\\n/g,'');
      var parse = JSON.parse(data);
      callback(0,parse);
   } catch(e){
      e = {e:e};
      e.metodmessage = 'ERROR: JSON.parse - '+data;
      callback(e);
   }
}
function readJSON(file,callback,jsonText){
   if (typeof jsonText === 'string') parseJSON(jsonText,callback);
   else readFile(file,function(e,data){
      if (e){ callback(e); }
      else { parseJSON(data,callback); }
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
function writeFile(file,data,callback){
   var dir = path.dirname(file);
   fs.exists(dir,function(exists){
      if (exists){
         fs.writeFile(file,data,'utf8',function(e){
            if (typeof callback === 'function') {
               if (e) {console.log(e);callback(e);}
               else callback(0);
            } else
               if (e) console.log(e);
         });
      } else { mkdir(dir,function(){writeFile(file,data,callback);}); }
   });
}
/* Кеширует готовые html файлы
 * html - текст html файла
 * htmlFile - путь к html файлу
 * file - путь запрошенный клиентом
 * hash - хеш от json файла страницы
 */
function cachePage(html,htmlFile,file,hash){
   cache[file]=hash;
   console.log(file+': '+hash);
   writeFile(htmlFile,html);
};
/* Проверяет актуальность кешированного файла
 * file - запрашиваемый файла
 * jsonFile - путь к json представлению файла
 * callback - функция для передачи результатов
 */
function checkCache (file,jsonFile,callback){
   readFile(jsonFile,function(e,data){
      if (e){ callback(e); }
      else {
         var hash = getHash(data);
         var cached = false;
         if (cache[file] === getHash(data)) cached = true;
         callback(0,cached,data,hash);
      }
   });
};
function wmParserLoderConstructor(wm){
   var $loder = {};
   /* Читает файл элемента
    * @param {string} name
    * @param {boolean} standard
    * @param {function} callback
    * @returns {callback}
    */
   $loder.getElement = function(name,standard,callback){
      var file = path.join(
         (standard?wm.pathWMinterface:wm.dataWM.path)
         ,'elements',name+'.json');
      // строить объект. вместо eval
      // b = new new Function("this.a = 123; console.log(this)")
      // b = new new Function("this.a = function(){console.log(1)}; console.log(this)")
      readJSON(file,callback);
   };
   /* Читает файл контрола
    * @param {string} name
    * @param {boolean} standard
    * @param {function} callback
    * @returns {callback}
    */
   $loder.getСontrol = function(name,standard,callback){
      var file = path.join(
         (standard?wm.pathWMinterface:wm.dataWM.path)
         ,'controls',name+'.json');
      readJSON(file,callback);
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
      var JSONcallback = function(hash){
         return function(e,data){
            if (e){ callback(e); }
            else {
               callback(0,data,
                  function(html){
                     cachePage(html,htmlFile,file,hash);
                  },
                  function(pid,js,callback){
                     var jsFile = path.join(wm.pathSite,'js',pid+'.js');
                     writeFile(jsFile,js,callback);
                  }
               );
            }
         };
      };
      checkCache(file,jsonFile,function(e,cached,jsonText,hash){
         if (e){ callback(e); }
         else {
            if (cached) {
               checkFile(htmlFile,function(e){
                  if (!e){ callback({HTTPCODE:304}); }
                  else { readJSON(jsonFile,JSONcallback(hash),jsonText); }
               });
            } else { readJSON(jsonFile,JSONcallback(hash),jsonText); }
         }
      });
   };
   /* Читает шаблон 
   * params - параметры для шаблона из страницы
   * callback - функция для передачи результатов
   */
   $loder.getTemplate = function(params,callback){
      var jsonFile = path.join(
         wm.rootSites,
         'web-morpher','interface','templates'
         ,params.name+'.json'
      );
      readJSON(jsonFile,callback);
   };
   return $loder;
};