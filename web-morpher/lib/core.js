var path = require('path');
var fs = require('fs');
var helper = require('./helper.js');
exports = module.exports = coreConstructor;
function coreConstructor(serv){
   if (!(this instanceof coreConstructor)) {return new coreConstructor(serv);}
   /* системные модули */
   var sys = {};
   sys.parser = require('../ulib/parser.js');
   sys.filemanager = require('./filemanager.js');
   /* модули сайта */
   var mod = {};
   var files = fs.readdirSync(serv.path.sitemod);
   for (var i=0; i < files.length; i++){
      files[i] = path.join(serv.path.sitemod,files[i]);
      if (fs.statSync(files[i]).isFile() && path.extname(files[i]) === '.js'){
         var name = path.basename(files[i],'.js');
         mod[name] = require(files[i]);
      }
   }
   delete files;
   /* Объект для взаимодействия модулей */
   var $wm = this;
   /* Передаем функцию подключения мдулей */
   $wm.findNodeModule = serv.findNodeModule;
   /*
    * @info отдает модулю путь к ресурсам по его имени из параметров сервера
    * @param {string} pathName - имя пути
    * @returns {string} - путь к ресурсам
    */
   $wm.getPath = function(pathName){
      if (typeof pathName !== 'string'){
         console.log('Неверынй вызов $wm.getPath');
         return '';
      }
      if (pathName in serv.glPath)
         return serv.glPath[pathName];
      if (pathName in serv.path)
         return serv.path[pathName];
      console.log('Путь "'+pathName+'" не найден');
   };
   /*
    * @info Функция для вызова системных методов из модулей
    * @param {string} module - Имя модуля
    * @param {string} method - Имя функции
    * @returns {function} - Возвращает функцию выполняющую заданный метод
    */
   $wm.syscall = function(module,method){
      return function(){
         return calling($wm,sys,module,method,arguments);
      };
   };
   /*
    * @info Функция для вызова методов из модулей сайта
    * @param {string} module - Имя модуля
    * @param {string} method - Имя функции
    * @returns {function} - Возвращает функцию выполняющую заданный метод
    */
   $wm.modcall = function(module,method){
      return function(){
         return calling($wm,mod,module,method,arguments);
      };
   };
   /*
    * @info Функция для вызова POST методов из модулей сайта
    * @param {string} module - Имя модуля
    * @param {string} method - Имя функции
    * @returns {function} - Возвращает функцию выполняющую заданный метод
    */
   serv.POSTcall = function(call){
      call = call.split('.');
      var module = String(call[0]);
      var method = String(call[1]?call[1]:'');
      return function(){
         if (typeof module !== 'string' && typeof method !== 'string')
            return false;
         if (
                module in mod
                && typeof mod[module].POST === 'object'
                && !(mod[module].POST instanceof Array)
                && method in mod[module].POST
                && typeof mod[module].POST[method] === 'function'
         ){
            return mod[module].POST[method].apply($wm,arguments);
         } else return false;
      };
   };
   proxy(serv,$wm);
}
/*
 * @info Функция вызывающая методы из объектов
 * @param {object} $wm - Объект для взаимодействия модулей
 * @param {object} obj - объект из которого зовутся методы
 * @param {string} module - Имя модуля
 * @param {string} method - Имя функции
 * @param {object} params - Параметры передаваемые в функцию
 * @returns {any} - значение возвращаемое вызванной функцией
 */
function calling($wm,obj,module,method,params){
   function err(e){
      if (typeof params[params.length-1] === 'function')
         params[params.length-1](e);
      return e;
   }
   if (typeof module !== 'string' && typeof method !== 'string')
      return err('Неверные параметры:'+' module='+module+' method='+method);
   if (module in obj && method in obj[module]
         && typeof obj[module][method] === 'function'){
      return obj[module][method].apply($wm,params);
   } else return err('Функция '+module+'.'+method+' не найдена');
}
/*
 * @info проксирование обращений к серверу
 * @param {object} serv - Данные сервера
 * @param {object} $wm - Объект для взаимодействия модулей
 * @returns {undefined}
 */
function proxy(serv,$wm){
   var express = serv.express;
   var app = serv.app;
   function sendfile(req,res,file){
      fs.stat(file,function(err,stats){
         if (!err && stats.isFile())
            if (req.header("Cache-Control"))
               res.send(304,'Not Modified');
            else
               res.sendfile(file);
         else
            res.send(404,'Not found');
      });
   }
   function sendwi(req,res){
      var file = path.join(serv.glPath.wi,helper.cutDir(req.path,'/wm/wi'));
      sendfile(req,res,file);
   }
   function sendulib(req,res){
      var file = path.join(serv.glPath.wmulib,
         helper.cutDir(req.path,'/wm/wi/ulib'));
      sendfile(req,res,file);
   }
   function checkfile(req,res,next){
      var file = req.path;
      if (file[file.length-1] === '/') file += 'index.html';
      var extname = path.extname(file);
      if (extname === '') file += extname = '.html';
      file = path.join(serv.path.site,file);
      fs.stat(file,function(err,stats){
         if (!err && stats.isFile())
            next();
         else
            res.send(404,'Not found');
      });
   }
   function showinfo(req,res){
      res.send(serv.info());
   }
   function parser(req,res,next){
      var file = req.path;
      if (file[file.length-1] === '/') file += 'index.html';
      var extname = path.extname(file);
      if (extname === '') file += extname = '.html';
      switch (extname) {
         case '.html':
            var build = $wm.syscall('parser','build');
            build(file,req.query,function(e,data){
               if (e){
                  if (e.HTTPCODE === 304){
                     next();
                  } else {
                     res.send(e.HTTPCODE||500);
                     console.error(e);
                  }
               } else {
                  res.send(200,data);
               }
            });
         break;
         default: next();
      }
   }
   function modsPOST(req,res){
      if (serv.siteConf['maxFileSize']){
         var size = Number(serv.siteConf['maxFileSize']);
         for (var i in req.files){
            if (req.files[i].size > size*1048576){
               fs.unlink(req.files[i].path);
               delete req.files[i];
               res.send(200,'Максимальный размер файла '+size+' МБ');
            }
         }
      }
      function send(){
         for (var i in req.files){
            fs.unlink(req.files[i].path);
         }
         res.send.apply(res,arguments);
      }
      var method = serv.POSTcall(req.body.call);
      var result = method(req,send);
      if (result){
         if (result !== true)
            send(200,result);
      } else {
         send(404,'Метод не найден');
      }
   }
   function modsGET(req,res,next){
      res.send(200,req.query);
   }
   app.get('/wm/wi/lib/*',sendwi);
   app.get('/wm/wi/ext/*',sendwi);
   app.get('/wm/wi/ulib/*',sendulib);
   app.post('/wm',modsPOST);
   app.get('/wm',modsGET);
   if (serv.conf.showInfo) {
      app.get('/wm',showinfo);
      app.get('/wm/*',showinfo);
   }
   app.get('/*',parser);
   app.get('/*',checkfile);
   app.use(express.static(serv.path.site));
}