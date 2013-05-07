var path = require('path');
var fs = require('fs');
var helper = require('./helper.js');
exports = module.exports = coreConstructor;
function coreConstructor(serv){
   if (!(this instanceof coreConstructor)) {return new coreConstructor(serv);}
   /* системные модули */
   var sys = {};
   sys.formidable = require(serv.findNodeModule('formidable'));
   sys.parser = require('../ulib/parser.js');
   sys.filemanager = require('./filemanager.js');
   /* Объект для взаимодействия модулей */
   var $wm = this;
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
   if (module in obj && method in obj[module]){
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
   app.get('/wm/wi/lib/*',sendwi);
   app.get('/wm/wi/ext/*',sendwi);
   app.get('/wm/wi/ulib/*',sendulib);
   if (serv.conf.showInfo) {
      app.get('/wm',showinfo);
      app.get('/wm/*',showinfo);
   }
   app.get('/*',parser);
   app.get('/*',checkfile);
   app.use(express.static(serv.path.site));
}