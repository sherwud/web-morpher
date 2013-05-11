var path = require('path');
var fs = require('fs');
function itemform(type,button,header){
   return '<div class="wm-'+type+'itemform wm-itemform hide shadowbox">'
      +'<div class="wm-close menubutton"><div></div>X</div>'
      + button
      +'<div class="wm-art-header">'+header+'</div>'
      +'<span>Название</span>'
      +'<input maxlength="20" class="name" type="text"></input>'
      +'<span>Позиция</span>'
      +'<input maxlength="2" class="sort" type="text"></input>'
      +'<span>В меню</span>'
      +'<select class="parent"><option value="null">Главное меню</option></select>'
      +'<span>Теги</span>'
      +'<input maxlength="30" class="tags" type="text"></input>'
      +'<span style="display: block;">HTML код статьи</span>'
      +'<textarea class="html"></textarea>'
      +'</div>';
}
function removeSpecChars(str){
   if (typeof str !== 'string') return str;
   return str.replace(/[^-,.№@_A-Za-zА-Яа-яЁё 0-9]/g,'');
}
exports = module.exports = {};
exports.mainmenuSync = function(){
   var menu = '<menu type="context" id="contextmenu">'
      +'<menuitem icon="img/edit.png" onclick="$wm.edititemform.set(); $wm.edititemform.show();">Редактировать статью</menuitem>'
      +'</menu>'
      +'<a class="menuitem home active" href="/">Главная</a>'
      +'<a class="menuitem search" href="javascript: void(0)">Поиск</a>'
      +'<div id="menucontainer"></div>';
   return menu;
};
exports.itemformSync = function(type){
   var button = '<div class="wm-add menubutton"><div></div>add</div>';
   var header = 'Добавить статью';
   if (type !== 'add'){
      type = 'edit';
      button = '<div class="wm-save menubutton"><div></div>save</div>'
         +'<div class="wm-del menubutton"><div></div>del</div>';
      header = 'Редактировать статью';
   }
   return itemform(type,button,header);
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
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e,db){
      db.collection('mainmenu',function(e,collection){
         var data = req.body.data;
         var parent = 'null';
         var level = '0';
         if(data && data['parent'])
            parent = data['parent'];
         if(data && data['level'])
            level = String(Number(data['level'])+1);
         collection.find({parent:parent},{name:1,sort:1})
                   .sort({sort:1},function(e,cursor){
            cursor.toArray(function(e,items){
               var html = '';
               if (items)
                  for (var i=0;i<items.length;i++){
                     html += '<a '
                          +'rowid="'+String(items[i]._id)+'" '
                          +'sort="'+String(items[i].sort)+'" '
                          +'parent="'+String(items[i].parent)+'" '
                          +'tags="'+String(items[i].tags)+'" '
                          +'class="menuitem dbitem" href="javascript: void(0)">'
                          +items[i].name
                          +'</a>'
                          +'<div '
                          +'rowid="'+String(items[i]._id)+'" '
                          +'level="'+level+'" '
                          +'></div>'
                     ;
                  }
               send(200,html);
               db.close();
            });
         });
      });
   });
   return true;
};
exports.POST.getPage = function(req,send){
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e, db){
      db.collection('mainmenu',function(e,collection){
         collection.find({_id:mongodb.ObjectID(req.body.data._id)},{html:1},
               function(e,cursor){
            cursor.toArray(function(e,items){
               if (items) send(200,items[0].html);
               db.close();
            });
         });
      });
   });
   return true;
};
exports.POST.addmenu = function(req,send){
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e,db){
      db.collection('mainmenu',function(e,collection){
         var data = req.body.data;
         data['name'] = removeSpecChars(data['name']);
         data['sort'] = removeSpecChars(data['sort']);
         data['tags'] = removeSpecChars(data['tags']);
         if (data && data['sort'] && String(data['sort']).length < 2)
               data['sort'] = '0'+String(data['sort']);
         collection.insert(data);
         send(200,'ok');
         db.close();
      });
   });
   return true;
};
exports.POST.savemenu = function(req,send){
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e,db){
      db.collection('mainmenu',function(e,collection){
         var data = req.body.data;
         data['name'] = removeSpecChars(data['name']);
         data['sort'] = removeSpecChars(data['sort']);
         data['tags'] = removeSpecChars(data['tags']);
         if (data && data['sort'] && String(data['sort']).length < 2)
               data['sort'] = '0'+String(data['sort']);
         data._id = mongodb.ObjectID(data._id);
         collection.save(data);
         send(200,'ok');
         db.close();
      });
   });
   return true;
};
exports.POST.delmenu = function(req,send){
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e,db){
      db.collection('mainmenu',function(e,collection){
         collection.remove({_id:mongodb.ObjectID(req.body.data._id)});
         send(200,'ok');
         db.close();
      });
   });
   return true;
};
exports.POST.getSearch = function(){
   var search = '<div id="searchform">'
   +'<input class="search" type="text"></input>'
   +'<div class="searchbutton"><div></div>Поиск</div>'
   +'<div class="radio">'
   +'<input class="o-and" type="radio"></input><span>AND</span>'
   +'<input class="o-or" checked="checked" type="radio"></input><span>OR</span>'
   +'</div>'
   +'<div class="checkbox">'
   +'<input class="menu" type="checkbox"></input><span>В меню</span>'
   +'<input class="tags" type="checkbox"></input><span>В тегах</span>'
   +'<input class="text" checked="checked" type="checkbox"></input><span>В тексте</span>'
   +'</div>'
   +'</div>'
   +'<div id="searchresult"></div>'
   ;return search;
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