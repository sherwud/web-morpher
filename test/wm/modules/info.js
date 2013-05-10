var path = require('path');
var fs = require('fs');
exports = module.exports = {};
exports.mainmenuSync = function(){
   var menu = 
      '<a class="menuitem active" href="/">Главная</a>'
      +'<a rowid="1" class="menuitem" href="javascript: void(0)">О системе</a>';
   return menu;
};
exports.NodeJS_Info = function(){
   var info = '&nbsp;&nbsp;&nbsp;<b>Node</b> или <b>Node.js</b> — серверная реализация языка программирования JavaScript, основанная на движке V8. Предназначена для создания масштабируемых распределённых сетевых приложений, таких как веб-сервер.'
   +'<br>&nbsp;&nbsp;&nbsp;Основной упор в Node делается на создании высокопроизводительных, хорошо масштабируемых клиентских и серверных приложений для «веб реального времени».'
   +'<br>&nbsp;&nbsp;&nbsp;Node разработал Райан Дал (англ. Ryan Dahl) в 2009 году после двух лет экспериментирования с созданием серверных веб-компонентов. В ходе своих исследований он пришел к выводу, что вместо традиционной модели параллелизма на основе потоков следует обратиться к событийно-ориентированным системам. Эта модель была выбрана за простоту, за низкие накладные расходы, по сравнению с идеологией «один поток на каждое соединение», и за быстродействие. Целью Node является предложить «простой способ построения масштабируемых сетевых серверов».'
   +'&nbsp;&nbsp;&nbsp;<p><b>Примеры кода</b><br>'
   +'&nbsp;&nbsp;&nbsp;Создание и запуск HTTP-сервера на Node.js, выдающего Hello, world!:'
   +'<span class="wm-code js">'
   +'var http = require(\'http\');\n'
   +'http.createServer(function (req, res) {\n'
   +'   res.writeHead(200, {\'Content-Type\': \'text/plain\'});\n'
   +'   res.end(\'Hello World\');\n'
   +'}).listen(1337, \'127.0.0.1\');\n'
   +'console.log(\'Server running at http://127.0.0.1:1337/\');\n'
   +'</span>'
   +'&nbsp;&nbsp;&nbsp;Другой пример скрипта, создающего TCP-сервер, который прослушивает порт 1337 и выводит на экран все, что вводит пользователь:'
   +'<span class="wm-code js">'
   +'var net = require(\'net\');\n'
   +'var server = net.createServer(function (stream) {\n'
   +'    stream.setEncoding(\'utf8\');\n'
   +'    stream.addListener(\'connect\', function () {\n'
   +'        stream.write(\'hello\\r\\n\');\n'
   +'    });\n'
   +'    stream.addListener(\'data\', function (data) {\n'
   +'        stream.write(data);\n'
   +'    });\n'
   +'    stream.addListener(\'end\', function () {\n'
   +'        stream.write(\'goodbye\\r\\n\');\n'
   +'        stream.end();\n'
   +'    });\n'
   +'});\n'
   +'server.listen(1337, \'localhost\');\n'
   +'</span>'
   
   +'</p>'
   ;return info;
};
exports.POST = {};
exports.POST.menu = function(req,send){
   send(200,req.body.data);
   return true;
};
exports.POST.upload = function(req,send){
   if (req.files && req.files['image'])
      fs.readFile(req.files.image.path,'base64',function(e, data){
         if (e) send(e);
         else {
            var image = 'data:' + req.files.image.type + ';base64,'+data;
            send(200,'<img src="'+image+'"/>');
         }
      });
   else return 'Картинка не передана';
   return true;
};