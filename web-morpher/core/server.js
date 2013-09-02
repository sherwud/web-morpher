var express = wm.ext.express;
var app = express();
var config = {};
var modules = wm.modules;
exports = module.exports = {};
exports.prepare = serverPrepare;
exports.listen = serverListen;
function defineMethod(type,module,method){

   // сразу отдавать обработчик если есть

   var logprm = {'title':'function defineMethod'};
   var eMNF = 'MODULE_NOT_FOUND';
   if (!(module in modules)) {
      try {
         var cur_module = modules[module];
      } catch(e) {
         if (e[0].code !== eMNF || e[1].code !== eMNF) {
            if (e[0].code !== eMNF) wmlog(e[0],logprm);
            if (e[1].code !== eMNF) wmlog(e[1],logprm);
            return [500,'Ошибка загрузки модуля "'+module+'"!'];
         } else {
            wmlog('Модуль "'+module+'" не найден!',logprm);
            return [404,'Модуль "'+module+'" не найден!'];
         }
      }
   } else cur_module = modules[module];
   try {
      var web_handlers = cur_module.web_handlers;
      if (web_handlers
            && typeof web_handlers !== 'object'
            && !web_handlers.__isProxy
            && typeof web_handlers.__getThis !== 'object'
         )
      {
         wmlog('Модуль "'+module+'": web_handlers is not object',logprm);
         return [404,'Модуль "'+module+'" не содержит внешних методов!'];
      }
   } catch(e) {
      if (e[0].code !== eMNF || e[1].code !== eMNF) {
         if (e[0].code !== eMNF) wmlog(e[0],logprm);
         if (e[1].code !== eMNF) wmlog(e[1],logprm);
         return [500,'Ошибка загрузки внешних методов модуля "'+module+'"!'];
      } else {
         wmlog('Модуль "'+module+'": web_handlers is not defined',logprm);
         return [404,'Модуль "'+module+'" не содержит внешних методов!'];
      }
   }
   
   // проверка наличия нужного обработчика для get/post
   /*if (!(type in modules)){
      res.send(404,'Обработка методов "'+type+'" не реализована!');
      return;
   }*/

   return [200,'TEST OK!'];
   
   if (module in modules[type] && method in modules[type][module])
      return [0,modules[type][module][method]];
   else {
      if (!(module in modules[type])) {
         try{
            modules[type][module] = wmabstract(
               config.siteroot+'/dynamic/modules/'+module+'_'+type,null,true
            );
         } catch (e) {
            if (e[0].code !== 'MODULE_NOT_FOUND'
             || e[1].code !== 'MODULE_NOT_FOUND'){
               wmlog(e,logprm);
               return [500,'Ошибка загрузки модуля "'+module+'"!'];
            } else {
               wmlog('Модуль "'+module+'_'+type+'" не найден!',logprm);
               return [404,'Модуль "'+module+'" не найден!'];
            }
         }
      }
      if (!(method in modules[type][module])) {
         wmlog('Метод "'+module+'_'+type+'.'+method+'" не найден!',logprm);
         return [404,'Метод "'+module+'.'+method+'" не найден!'];
      } else {
         return [0,modules[type][module][method]];
      }
   }
}
function handler(req,res){
   var module = req.params.module;
   var method = req.params.method;
   var type = req.route.method;
   var handler = defineMethod(type,module,method);
   if (handler[0]) {
      res.send(handler[0],handler[1]);
      return;
   } else handler = handler[1];
   var result = handler(req,res);
   if (result === false)
      res.send(500,'Ошибка выполнения метода "'+module+'.'+method+'"');
   else if (result !== true && result !== undefined)
      res.send(200,result);
}
function serverPrepare(conf){
   config = conf;
   if (config.server.bodyParser)
      app.use(express.bodyParser());
   var dynURL = '/{dynamicPrefix}:module/:method';
   try {
      dynURL = dynURL.replace('{dynamicPrefix}',config.server.dynamicPrefix);
   } catch (e){
      dynURL = dynURL.replace('{dynamicPrefix}','call/');
   }
   app.get(dynURL,handler);
   app.post(dynURL,handler);
   app.use(express.static(config.siteroot+'/static'));
   return exports;
}
function serverListen(port){
   var logprm = {type:0};
   app.listen(port||config.server.port);
   wmlog('Сайт: '+config.siteroot,logprm);
   wmlog('Запущен на порту: '+(port||config.server.port),logprm);
}