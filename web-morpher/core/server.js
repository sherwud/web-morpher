"use strict";
var path = wm.ext.path;
var util = wm.util;
var express = wm.ext.express;
var fs = wm.ext.fs;
var app = express();
var modules = {};
var __server = module.exports = {};
var config = __server.config = {};
__server.prepare = prepare;
__server.listen = listen;
function defineMethod(type, module, method) {
   var typeis = wm.util.typeis;
   if (module in modules) {
      var cur_module = modules[module];
      if (cur_module && type in cur_module) {
         var web_type = cur_module[type];
         if (web_type && method in web_type) {
            var handler = web_type[method];
            if (typeis(handler, 'function')) {
               return [0, handler];
            }
         }
      }
   }
   var wmlog = global.wmlog.init({'title': 'function defineMethod'});
   var iserror = function iserror(e) {
      var eMNF = 'MODULE_NOT_FOUND';
      if (e[0].code !== eMNF || e[1].code !== eMNF) {
         if (e[0].code !== eMNF) {
            wmlog(1, e[0]);
         }
         if (e[1].code !== eMNF) {
            wmlog(1, e[1]);
         }
         return true;
      } else {
         return false;
      }
   };
   if (!(module in modules)) {
      try {
         cur_module = modules[module];
      } catch (e) {
         if (iserror(e)) {
            return [500, 'Ошибка загрузки модуля "' + module + '"!'];
         } else {
            wmlog(404, 'Модуль "' + module + '" не найден!');
            return [404, 'Модуль "' + module + '" не найден!'];
         }
      }
   } else {
      cur_module = modules[module];
   }
   try {
      web_type = cur_module[type];
      if (!typeis(web_type, 'object')) {
         wmlog(1, 'Модуль "' + module + '" "' + type + '" is not object');
         return [404, 'Модуль "' + module
                  + '" не содержит обработчиков для метода "' + type + '"!'];
      }
   } catch (e) {
      if (iserror(e)) {
         return [500, 'Ошибка загрузки обработчиков метода "'
                  + type + '" из модуля "' + module + '"!'];
      } else {
         wmlog(404, 'Модуль "' + module + '": "' + type + '" is not defined');
         return [404, 'Модуль "' + module
                  + '" не содержит обработчиков для метода "' + type + '"!'];
      }
   }
   var handlerName = module + '.' + type + '.' + method;
   try {
      handler = web_type[method];
      if (!typeis(handler, 'function')) {
         wmlog(1, handlerName + ' is not function');
         return [404, 'Метод "' + handlerName + '" не найден!'];
      }
   } catch (e) {
      if (iserror(e)) {
         return [500, 'Ошибка загрузки метода "' + handlerName + '"!'];
      } else {
         wmlog(404, 'Метод "' + handlerName + ' is not defined');
         return [404, 'Метод "' + handlerName + '" не найден!'];
      }
   }
   return [0, handler];
}
function handler(req, res, next) {
   var module = req.params.module;
   var method = req.params.method;
   var type = req.route.method;
   var handler = defineMethod(type, module, method);
   if (handler[0]) {
      res.send(handler[0], handler[1]);
      return;
   } else {
      handler = handler[1];
   }
   var result = handler(req, res, next);
   if (result === false) {
      res.send(500, 'Ошибка выполнения метода "' + type + ':' + module + '.' + method + '"');
   } else if (result !== true && result !== undefined) {
      res.send(200, result);
   }
}
function prepare(conf) {
   var log = wmlog.init({'title': 'function server.prepare'});
   config = __server.config = conf;
   var tmpConf = {};
   try {
      tmpConf = require(config.siteroot + '/config.json');
   } catch (e) {
   }
   if (config.contentCompression)
      app.use(express.compress());
   app.use(express.json());
   app.use(express.urlencoded());
   if (config.fileUpload)
      app.use(express.multipart());
   app.use(express.cookieParser(tmpConf.sessionSecret || util.generateUUID()));
   app.use(express.cookieSession({
      key: config.sessionKey,
      cookie: {maxAge: config.sessionMaxAge}
   }));
   app.use(wm.lib.user);
   if (config.initfile) {
      try {
         var initfile = path.join(config.siteroot, 'dynamic', config.initfile);
         initfile = require(initfile);
         if (typeof initfile === 'function') {
            initfile({
               express: express,
               app: app,
               config: config,
               tmpConf: tmpConf
            });
         }
      } catch (e) {
         log(1, e);
      }
   }
   var pref = config.dynamicPrefix || '/call/';
   pref = String(pref).replace(/(^[^/])/, '/$1').replace(/([^/]$)/, '$1/');
   var URL = pref + ':module/:method';
   modules = wm['request-modules'];
   if (modules !== false) {
      app.get(URL, handler);
      app.post(URL, handler);
   }
   if (fs.existsSync(config.siteroot + '/static')) {
      app.use(express.static(config.siteroot + '/static'));
   }
   return __server;
}
function listen(port) {
   var wmlog = global.wmlog.init();
   app.listen(port || config.port);
   wmlog(0, 'Сайт: ' + config.siteroot);
   wmlog(0, 'Запущен на порту: ' + (port || config.port));
}