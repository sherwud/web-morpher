var express = wm.ext.express;
var app = express();
var config = {};
var modules = {
   'get':{},
   'post':{}
};
exports = module.exports = {};
exports.prepare = serverPrepare;
exports.listen = serverListen;
function defineMethod(type,module,method){
   if (module in modules[type] && method in modules[type][module])
      return [0,modules[type][module][method]];
   else {
      if (!(module in modules[type])) {
         return [404,'Модуль "'+module+'" не найден!'];
      }
      if (!(method in modules[type][module])) {
         return [404,'Метод "'+module+'.'+method+'" не найден!'];
      }
   }
}
function handler(req,res){
   var module = req.params.module;
   var method = req.params.method;
   var type = req.route.method;
   if (!(type in modules)){
      res.send(404,'Обработка методов "'+type+'" не реализована!');
      return;
   }
   var handler = defineMethod(type,module,method);
   if (handler[0]) {
      res.send(handler[0],handler[1]);
      return;
   } else handler = handler[1];
   res.send(200,{
      module:req.params.module,
      method:req.params.method
   });
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