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
   var logprm = {'title':'function defineMethod'};
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
   if (!(type in modules)){
      res.send(404,'Обработка методов "'+type+'" не реализована!');
      return;
   }
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