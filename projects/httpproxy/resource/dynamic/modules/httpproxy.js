"use strict";
var http = wm.ext.http;
var net = wm.ext.net;
var url = wm.ext.url;
var dns = wm.ext.dns;
var os = wm.ext.os;
var util = wm.util;

exports = module.exports = {
   proxyServerHandler:proxyServerHandler
};

function proxyServerHandler(req, res){
   var sendError = sendError_setter(req, res);
   var client_ip = req.socket.remoteAddress;
   var curURL = url.parse('http://'+req.headers.host+req.url,true);
   if (!curURL.query.url) {
      sendError(400,'400 Bad Request: url is not set - '+curURL.href);
      return;
   }
   var tarURL = curURL.query.url;
   if (tarURL.substr(0,8) === 'https://') {
      sendError(400,'400 Bad Request: HTTPS protocol is not supported');
      return;
   }
   if (tarURL.substr(0,7) !== 'http://') tarURL = 'http://'+tarURL;
   tarURL = url.parse(tarURL,true);
   
   if (!(curURL.hostname && tarURL.hostname)){
      sendError(400,'400 Bad Request: bad url, host name is not set - '+curURL.href);
      return;
   }
   checkAccess(tarURL, client_ip, function(ecode,msg){
      if (ecode) {
         sendError(ecode,msg);
         return;
      }
      log('client ip:',client_ip,'-','connect','target:',curURL.query.url);
      var disconnect_client = connect_client_setter(client_ip);
      proxyHTTP(req, res, curURL, tarURL, function(end,msg){
         log('client ip:',client_ip,'-',msg);
         if (end) disconnect_client();
      });
   });
}


var clients = {};
var clients_count = 0;

var use_clients_ip_white_list = 1;
var clients_ip_white_list = {
   '10.76.155.43':1
  ,'10.76.115.17':0
  ,'10.76.113.231':1
  ,'127.0.0.1':1
};
var use_clients_name_white_list = true;
var clients_name_white_list = {
   'localhost':1
};
var use_host_white_list = true;
var host_white_list = {
   'sc-reggae-128kmp3.1.fm':true
  ,'10.76.155.225':true
  ,'nodejs.org':1
  ,'www.google.ru':1
  ,'google.ru':1
  ,'ya.ru':1
  ,'www.yandex.ru':1
  ,'localhost':1
};

function log(){
   var msg = '';
   for (var i in arguments) {
      msg += arguments[i]+'';
   }
   wmlog(msg,{code:2});
}

function client_logger(){
   var cts = '  ';
   for (var i in clients) cts += ' ' + clients[i];
   log('clients: '+clients_count);
   console.log(cts);
}

function connect_client_setter(client_ip){
   var UUID = util.generateUUID();
   clients[UUID]=client_ip;
   clients_count++;
   client_logger();
   return function(){
      if (UUID in clients) {
         delete clients[UUID];
         clients_count--;
         client_logger();
      }
   };
}

function sendError_setter(req, res) {
   return function (ecode,msg) {
      res.writeHead(ecode, {'Content-Type': 'text/plain'});
      res.end(msg);
      log('client ip:',req.socket.remoteAddress,'-',msg);
   };
}

function checkAccess(tarURL, client_ip, callback){
   function checkIP(nomsg){
      if (use_clients_ip_white_list && !(client_ip in clients_ip_white_list && clients_ip_white_list[client_ip])) {
         if (!nomsg) callback(403,'403 Forbidden by client IP address: '+client_ip);
         return false;
      } else return true;
   }
   function checkHost(){
      if (use_host_white_list && !(tarURL.hostname in host_white_list && host_white_list[tarURL.hostname])) {
         callback(403,'403 Forbidden by requested host name: '+tarURL.hostname);
         return false;
   } else return true;
   }
   if (checkIP(true)) {
      if (!checkHost()) return;
      callback();
   } else {
      if (use_clients_name_white_list) {
         dns.reverse( client_ip, function onReverse( err, domains ) {
            if (!err) {
               if (!(domains[0] in clients_name_white_list && clients_name_white_list[domains[0]])) {
                  if (!checkIP()) return;
               } else {
                  log('connected -',domains[0]);
               }
               if (!checkHost()) return;
               callback();
            } else {
               if (!checkIP()) return;
               if (!checkHost()) return;
               callback();
            }
         });
      } else {
         if (!checkIP()) return;
         if (!checkHost()) return;
         callback();
      }
   }
}

function proxyNET(req, curURL, tarURL, callback){
   var error = false;
   var httpreq = req.method + ' ' + tarURL.path + ' HTTP/' + req.httpVersion+'\r\n';
   for (var i in req.headers) {
      if (i === 'host') {
         httpreq+= i + ': ' + tarURL.host + '\r\n';
      } else {
         httpreq+= i + ': ' + req.headers[i] + '\r\n';
      }
   }
   httpreq+='\r\n';
   var srvSocket = net.connect(tarURL.port || 80, tarURL.hostname, function() {
     srvSocket.write(httpreq);
     srvSocket.pipe(req.socket);
     req.socket.pipe(srvSocket);
   });
   srvSocket.on('end',function(){
      req.socket.end();
      callback();
   });
   req.socket.on('end',function(){
      srvSocket.end();
      callback();
   });
   srvSocket.on('error',function(err){
      req.socket.destroy();
      srvSocket.destroy();
      if (!error) {
         error = true;
         log('srvSocket error ->',err);
         callback();
      }
   });
   req.socket.on('error',function(err){
      srvSocket.destroy();
      req.socket.destroy();
      if (!error) {
         error = true;
         log('client error ->',err);
         callback();
      }
   });
}

function proxyHTTP(req, res, curURL, tarURL, callback) {
   var options = {
      hostname: tarURL.hostname
     ,port: tarURL.port || 80
     ,method: req.method
     ,path: tarURL.path
     ,headers: {}
     //,agent: false
   };
   for (var i in req.headers) { options.headers[i] = req.headers[i]; }
   options.headers.host = tarURL.hostname;
   var tarreq = http.request(options, function(tarres) {
      var httptarres =  'HTTP/' + tarres.httpVersion+ ' '+tarres.statusCode+ ' '+http.STATUS_CODES[tarres.statusCode]+'\r\n';
      if (tarres.headers.location) {
         var location = curURL.protocol + (curURL.slashes?'//':'') + curURL.host + curURL.pathname;
         var q = false;
         for (var i in curURL.query) {
            if (q) { location += '&'; } else { location += '?'; q = true; }
            if (i === 'url') {
               location += i + '=' + tarres.headers.location;
            } else {
               location += i + '=' + curURL.query[i];
            }
         }
         callback(0,'redirected: '+location);
      }
      for (var i in tarres.headers) {
         if (i === 'location') {
            httptarres+= i + ': ' + location + '\r\n';
         } else {
            httptarres+= i + ': ' + tarres.headers[i] + '\r\n';
         }
      }
      httptarres+='\r\n';
      req.socket.write(httptarres);
      tarres.on('data', function (data) {
         req.socket.write(data);
      });
      tarres.on('end', function () {
         req.socket.end();
         callback(1,'disconnect target: '+curURL.query.url);
      });
   });
   tarreq.on('error', function(http_e) {
      callback(0,'used net proxy');
      proxyNET(req, curURL, tarURL, function(net_e){
         if (net_e) {
            callback(1,'Ошибка подключения!');
            log('http -',http_e);
            log('http -',http_e.stack);
            log('net -',net_e);
            log('net -',net_e.stack);
         } else {
            callback(1,'disconnect target: '+curURL.query.url);
         }
      });
   });
   /* Добавить запись данных если не пройдет передача файлов
   tarreq.write('data\n');
   */
   tarreq.end();
}

/* получение ip адресов
log(os.networkInterfaces())
 */