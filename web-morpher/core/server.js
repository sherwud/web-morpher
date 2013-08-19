var express = wm.ext.express;
var app = express();
var config = {};
exports = module.exports = {};
exports.prepare = serverPrepare;
exports.listen = serverListen;
function serverPrepare(conf){
   config = conf;
   if (config.server.bodyParser)
      app.use(express.bodyParser());
   
   app.use(express.static(config.siteroot+'/static'));
   return exports;
}
function serverListen(port){
   var logprm = {type:0};
   app.listen(port||config.server.port);
   wmlog('Сайт: '+config.siteroot,logprm);
   wmlog('Запущен на порту: '+(port||config.server.port),logprm);
}