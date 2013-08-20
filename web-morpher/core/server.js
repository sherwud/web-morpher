var express = wm.ext.express;
var app = express();
var config = {};
exports = module.exports = {};
exports.prepare = serverPrepare;
exports.listen = serverListen;
function handlerGET(req,res){
   res.send(200,{
      module:req.params.module,
      method:req.params.method
   });
}
function handlerPOST(req,res){
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
   app.get(dynURL,handlerGET);
   app.post(dynURL,handlerPOST);
   app.use(express.static(config.siteroot+'/static'));
   return exports;
}
function serverListen(port){
   var logprm = {type:0};
   app.listen(port||config.server.port);
   wmlog('Сайт: '+config.siteroot,logprm);
   wmlog('Запущен на порту: '+(port||config.server.port),logprm);
}