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
      if (!e && stats.isFile()) callback(0);
      else callback(e||{error:'File not found!'});
   });
};
function readFile(file,callback){
   checkFile(file,function(e){
      if (e) {
         e.HTTPCODE = 404;
         callback(e);
      } else {
         fs.readFile(file,'utf8',function(e,data){
            if (e) callback(e); else callback(0,data);
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
      e.method = 'parserLoder.js: parseJSON';
      e.data = data;
      callback(e);
   }
}
function readJSON(file,callback,jsonText){
   var recallback = function(e,data){
      if (e) { e.file = file; callback(e); }
      else callback(0,data);
   };
   if (typeof jsonText === 'string') parseJSON(jsonText,recallback);
   else readFile(file,function(e,data){
      if (e) callback(e); else { parseJSON(data,recallback); }
   });      
};
function mkdir(dir,callback){
   var parentDir = path.dirname(dir);
   fs.exists(parentDir,function(exists){
       if (exists){
          fs.mkdir(dir,function(e){
             if (e) { callback(e); } else { callback(0); }
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
               if (e) {console.error(e);callback(e);}
               else callback(0);
            } else if (e) console.error(e);
         });
      } else { mkdir(dir,function(e){
         if (e) {
            if (typeof callback === 'function') callback(e);
            else console.error(e);
         } else writeFile(file,data,callback);
      }); }
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
function checkCache(file,jsonFile,callback){
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
exports = module.exports = {};
/* Читает файл элемента
 * @param {string} name
 * @param {boolean} standard
 * @param {function} callback
 * @returns {callback}
 */
exports.getElement = function(name,standard,callback){
   var getPath = this.getPath;
   var file = path.join(
          (standard?getPath('wirese'):getPath('sitee')),name+'.json'
       );
   readJSON(file,function(e,data){
      if(e) callback(e);
      else {
         if (data.builders instanceof Object) {
            for (var i in data.builders){
               var funcBody = 'var key=\''+i+'\';'+'var name=\''+name+'\';'
                  +'var standard='+String(standard)+';'+data.builders[i];
               try { data.builders[i] = Function('data,element',funcBody); }
               catch(e){
                  e = {e:e};
                  e.method = '$loder.getElement';
                  e.element = Number(standard)+name;
                  e.key = i;
                  e.funcBody = funcBody;
                  callback(e);
                  return;
               }
            }
         } else data.builders = {};
         callback(0,data);
      }
   });
};
/* Читает файл контрола
 * @param {string} name
 * @param {boolean} standard
 * @param {function} callback
 * @returns {callback}
 */
exports.getСontrol = function(name,standard,callback){
   var getPath = this.getPath;
   var file = path.join(
          (standard?getPath('wiresc'):getPath('sitec')),name+'.json'
       );
   readJSON(file,callback);
};
/* Читает файл страцы из json, или из html, если страница кеширована
* file - путь к странице
* callback - функция для передачи результатов
* callback(e,data)
* e - ошибка, 0 если нет ошибки
* data - данные для отправки
*/
exports.getPage = function(file,callback){
   var getPath = this.getPath;
   var site = getPath('site');
   var htmlFile = path.join(site,file);
   var jsonFile = path.join(
      getPath('sitepages'),
      path.dirname(file),
      path.basename(file,path.extname(file))+'.json'
   );
   var JSONcallback = function(hash){
      return function(e,data){
         if (e){ callback(e); }
         else {
            callback(0,data,
               function(html){
                  var cached = data.config.cached;
                  if (cached) cachePage(html,htmlFile,file,hash);
               },
               function(pid,js,callback){
                  var jsFile = path.join(site,'js',pid+'.js');
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
exports.getTemplate = function(params,callback){
   var getPath = this.getPath;
   var standard = params.standard;
   var jsonFile = path.join(
          (standard?getPath('wirest'):getPath('sitet')),params.name+'.json'
       );
   readJSON(jsonFile,callback);
};