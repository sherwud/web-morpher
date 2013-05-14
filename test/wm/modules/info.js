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
      +'<select class="parent"><option value="null">'
      +'Главное меню</option></select>'
      +'<span>Теги</span>'
      +'<input maxlength="30" class="tags" type="text"></input>'
      +'<span style="display: block;">HTML код статьи</span>'
      +'<div class="toolbar">'
      +'<div class="codejs btn"><div></div>code:js</div>'
      +'<div class="codejson btn"><div></div>code:json</div>'
      +'<div class="codehttp btn"><div></div>code:http</div>'
      +'<div class="codecmd btn"><div></div>code:cmd</div>'
      +'<div class="sep">|</div>'
      +'<div class="font b btn"><div></div><b>b</b></div>'
      +'<div class="font i btn"><div></div><i>i</i></div>'
      +'<div class="font s btn"><div></div><s>s</s></div>'
      +'<div class="font h2 btn"><div></div>h2</div>'
      +'<div class="font h4 btn"><div></div>h4</div>'
      +'<div class="font size btn"><div></div>size</div>'
      +'<div class="font color btn"><div></div>color</div>'
      +'<div class="sep">|</div>'
      +'<div class="usespace btn"><div></div>use:space</div>'
      +'<div class="length right txt"></div>'
      +'<div class="sellength right txt"></div>'
      +'</div>'
      +'<textarea class="html"></textarea>'
      +'</div>';
}
function removeSpecChars(str){
   if (typeof str !== 'string') return str;
   return str.replace(/[^-,.№@_A-Za-zА-Яа-яЁё 0-9]/g,'');
}
function removeSpecCharsSearch(str){
   if (typeof str !== 'string') return str;
   return removeSpecChars(str)
      .replace(/([-,.№@_ ])/g,'\\$1');
}
function removeHTML(str){
   if (typeof str !== 'string') return str;
   return str.replace(/\<[^\<]*\>/g,' ').replace(/\s+/g,' ');
}
exports = module.exports = {};
exports.mainmenuSync = function(){
   var menu = '<menu type="context" id="contextmenu">'
      +'<menuitem icon="img/edit.png" onclick="$wm.edititemform.set();'
      +' $wm.edititemform.show();">Редактировать статью</menuitem>'
      +'</menu>'
      +'<a class="menuitem home active" href="/">Главная</a><div level="0">'
      +'<a class="menuitem search" href="javascript: void(0)">Поиск</a>'
      +'<a class="menuitem images" href="javascript: void(0)">Картинки</a>'
      +'</div><div id="menucontainer"></div>';
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
   var info = '&nbsp;&nbsp;&nbsp;<b>Node</b> или <b>Node.js</b>'
   +' — серверная реализация языка программирования JavaScript, '
   +'основанная на движке V8. Предназначена для создания масштабируемых'
   +' распределённых сетевых приложений, таких как веб-сервер.'
   +'<br>&nbsp;&nbsp;&nbsp;Основной упор в Node делается на создании'
   +' высокопроизводительных, хорошо масштабируемых клиентских и серверных'
   +' приложений для «веб реального времени».'
   +'<br>&nbsp;&nbsp;&nbsp;Node разработал Райан Дал (англ. Ryan Dahl)'
   +' в 2009 году после двух лет экспериментирования с созданием серверных'
   +' веб-компонентов. В ходе своих исследований он пришел к выводу, что '
   +'вместо традиционной модели параллелизма на основе потоков следует '
   +'обратиться к событийно-ориентированным системам. Эта модель была'
   +' выбрана за простоту, за низкие накладные расходы, по сравнению '
   +'с идеологией «один поток на каждое соединение», и за быстродействие.'
   +' Целью Node является предложить «простой способ построения '
   +'масштабируемых сетевых серверов».'
   +'&nbsp;&nbsp;&nbsp;<p><b>Примеры кода</b><br>'
   +'&nbsp;&nbsp;&nbsp;Создание и запуск HTTP-сервера на Node.js,'
   +' выдающего Hello, world!:'
   +'<span class="wm-code js">'
   +'var http = require(\'http\');\n'
   +'http.createServer(function (req, res) {\n'
   +'   res.writeHead(200, {\'Content-Type\': \'text/plain\'});\n'
   +'   res.end(\'Hello World\');\n'
   +'}).listen(1337, \'127.0.0.1\');\n'
   +'console.log(\'Server running at http://127.0.0.1:1337/\');\n'
   +'</span>'
   +'&nbsp;&nbsp;&nbsp;Другой пример скрипта, создающего TCP-сервер, '
   +'который прослушивает порт 1337 и выводит на экран все,'
   +' что вводит пользователь:'
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
exports.POST.menu = function(req,res){
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
                        +'_id="'+String(items[i]._id)+'" '
                        +'sort="'+String(items[i].sort)+'" '
                        +'parent="'+String(items[i].parent)+'" '
                        +'tags="'+String(items[i].tags)+'" '
                        +'class="menuitem dbitem" href="javascript: void(0)">'
                        +items[i].name
                        +'</a>'
                        +'<div '
                        +'_id="'+String(items[i]._id)+'" '
                        +'level="'+level+'" '
                        +'></div>'
                     ;
                  }
               res.send(200,html);
               db.close();
            });
         });
      });
   });
   return true;
};
exports.POST.getPage = function(req,res){
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e, db){
      db.collection('mainmenu',function(e,collection){
         var data = req.body.data;
         collection.find({_id:mongodb.ObjectID(data._id)},{name:1,html:1,tags:1},
               function(e,cursor){
            cursor.toArray(function(e,items){
               if (items && items.length > 0) res.send(200,items[0]);
               else res.send(404,'Страница не найдена');
               db.close();
            });
         });
      });
   });
   return true;
};
exports.POST.addmenu = function(req,res){
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
         data['text'] = removeHTML(data['html']);
         if (data && data['sort'] && String(data['sort']).length < 2)
               data['sort'] = '0'+String(data['sort']);
         collection.insert(data);
         res.send(200,'ok');
         db.close();
      });
   });
   return true;
};
exports.POST.savemenu = function(req,res){
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
         data['text'] = removeHTML(data['html']);
         if (data && data['sort'] && String(data['sort']).length < 2)
               data['sort'] = '0'+String(data['sort']);
         data._id = mongodb.ObjectID(data._id);
         collection.save(data);
         res.send(200,'ok');
         db.close();
      });
   });
   return true;
};
exports.POST.delmenu = function(req,res){
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e,db){
      db.collection('mainmenu',function(e,collection){
         collection.remove({_id:mongodb.ObjectID(req.body.data._id)});
         res.send(200,'ok');
         db.close();
      });
   });
   return true;
};
exports.POST.getSearch = function(){
   var search = '<div id="searchform">'
   +'<input maxlength="50" class="search" placeholder="Поиск статьи" type="text"></input>'
   +'<div class="searchbutton"><div></div>Поиск</div>'
   +'<div class="checkbox">'
   +'<input class="menu" type="checkbox"></input><span>В меню</span>'
   +'<input class="tags" type="checkbox"></input><span>В тегах</span>'
   +'<input class="text" checked="checked" type="checkbox"></input><span>В тексте</span>'
   +'</div>'
   +'<div class="radio">'
   +'<input class="o-and" type="radio"></input><span>AND</span>'
   +'<input class="o-or" checked="checked" type="radio"></input><span>OR</span>'
   +'</div>'
   +'</div>'
   +'<div id="searchresult"></div>'
   +'<div id="viewfromsearchresult" class="hide">'
   +'<div class="vf-header">'
   +'<a class="backtosearch" href="javascript: void(0)">'
   +'&lt;- Назад к поиску</a>'
   +'<span class="view-header"></span>'
   +'</div>'
   +'<div class="view"></div>'
   +'</div>'
   ;return search;
};
exports.POST.search = function(req,res){
   function initsearch(data){
      var repl = new RegExp(data.search,'i');
      var fields = [];
      if (data.menu) fields.push({name:repl});
      if (data.tags) fields.push({tags:repl});
      if (data.text) fields.push({text:repl});
      if (data.and) return { $and: fields };
      else return { $or: fields };
   }
   function cuttext(str,search){
      var max = 500;
      var len = str.length;
      if (typeof str !== 'string') return str;
      if (len < max) return str;
      var readmore = '<a href="javascript: void(0)" class="readmore">'
         +'Читать дальше...</a>';
      var idx = str.search(new RegExp(search,'i'));
      if (idx !== -1) {
         var a = idx - (max / 2 ^ 0);
         var b = idx + max / 2 ^ 0;
         if (a < 0) { b+=Math.abs(a); a = 0;}
         if (b > len) { a-=b-len; b = len; };
         str = str.substring(a,b);
         if (a>0) str = '...'+str;
         if (b<len) str+='...';
      } else str = str.substring(0,max-1);
      str += readmore;
      return str;
   }
   function selsearch(str,search,is){
      if (typeof str !== 'string') return str;
      if (is) str = str.replace(new RegExp('('+search+')','gi'),'<b>$1</b>');
      return str;
   }
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e, db){
      db.collection('mainmenu',function(e,collection){
         var data = req.body.data;
         data.search = removeSpecCharsSearch(data.search);
         if (!data.search){
            res.send(200,'Ничего не найдено');
            return;
         }
         collection.find(initsearch(data),{name:1,text:1,tags:1},
               function(e,cursor){
            cursor.toArray(function(e,items){
               if (items && items.length > 0) {
                  var html = '';
                  for (var i=0;i<items.length;i++){
                     items[i].text = cuttext(items[i].text,data.search);
                     html += '<div'
                        +' _id="'+String(items[i]._id)+'" '
                        +' class="article">'
                        +'<a href="javascript: void(0)" class="a-header">'
                        +selsearch(items[i].name,data.search,data.menu)+'</a>'
                        +'<span class="text">'
                        +selsearch(items[i].text,data.search,data.text)
                        +'</span>'
                        +'<span class="tags"><span>Теги: </span>'
                        +selsearch(items[i].tags,data.search,data.tags)
                        +'</span>'
                        +'</div>';
                  }
                  res.send(200,html);
               } else res.send(200,'Ничего не найдено');
               db.close();
            });
         });
      });
   });
   return true;
};
exports.POST.upload = function(req,res){
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   if (req.files && req.files['image'])
      fs.readFile(req.files.image.path,'base64',function(e, data){
         if (e) res.send(e);
         else {
            var mongodb = require(findNodeModule('mongodb'));
            var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
            var db = new mongodb.Db(conf.dbname,
               new mongodb.Server(conf.host,conf.port,{}),{safe:false});
            db.open(function(e,db){
               db.collection('images',function(e,collection){
                  var ins = {
                     base64:data,
                     type:req.files.image.type
                  };
                  collection.insert(ins);
                  res.send(200,'<html style="height: 100%;">'
                     +'<body style="height:100%; margin:0; text-align:center;">'
                     +'<span style="margin: 8px; display: inline-block;">'
                     +'Картинка успешно отправлена | </span>'
                     +'<a style="margin-right: 8px;" href="/">'
                     +'Вернуться на главную</a>'
                     +'<span> | Ссылка</span>'
                     +'<input onclick="this.select();" '
                     +'style="width: 350px; margin-left: 4px;" value="'
                     +'/wm/call/info/getImage?_id='+ins._id
                     +'"></input>'
                     +'<div>'
                     +'<img style="max-width: 800px; max-height: 600px;" '
                     +'src="'+'/wm/call/info/getImage?_id='+ins._id+'">'
                     +'</div>'
                     +'</body></html>'
                  );
                  db.close();
               });
            });
         }
      });
   else return 'Картинка не передана';
   return true;
};
exports.POST.getImages = function(req,res){
   var html = '<form class=\"wm-upload\" enctype=\"multipart/form-data\"'
         +'method=\"post\" action=\"/wm\">'
         +'<span>Загрузить </span>'
         +'<input type=\"text\" class=\"hide\" name=\"call\" value=\"info.upload\">'
         +'<input required size=\"54\" type=\"file\" accept=\"image/*\" name=\"image\">'
         +'<input type=\"submit\" value=\"Отправить\">'
         +'</form>';
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e, db){
      db.collection('images',function(e,collection){
         collection.find({},{data:0,type:0},
               function(e,cursor){
            cursor.toArray(function(e,items){
               if (items && items.length > 0) {
                  for (var i=0;i<items.length;i++){
                     html += '<div class="res-images">'
                        +'<div class="img">'
                        +'<a target="blank" href="'
                        +'/wm/call/info/getImage?_id='+items[i]._id+'">'
                        +'<img src="'+'/wm/call/info/getImage?_id='
                        +items[i]._id+'">'
                        +'</a>'
                        +'</div>'
                        +'<div class="info">'
                        +'<div class="del"'
                        +'_id="'+items[i]._id+'"'
                        +'></div>'
                        +'<span>Ссылка</span>'
                        +'<input onclick="this.select();" value="'
                        +'/wm/call/info/getImage?_id='+items[i]._id
                        +'"></input>'
                        +'<span>Для статьи</span>'
                        +'<input onclick="this.select();" value="'
                        +'<img class=&quot;wm&quot; src=&quot;'
                        +'/wm/call/info/getImage?_id='+items[i]._id+'&quot;>'
                        +'"></input>'
                        +'</div>'
                        +'</div>';
                  }
                  res.send(200,html);
               } else {
                  html += '<span>Ничего не найдено</span>';
                  res.send(200,html);
               }
               db.close();
            });
         });
      });
   });
   return true;
};
exports.POST.delImage = function(req,res){
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e,db){
      db.collection('images',function(e,collection){
         collection.remove({_id:mongodb.ObjectID(req.body.data._id)});
         res.send(200,'ok');
         db.close();
      });
   });
   return true;
};
exports.GET = {};
exports.GET.getImage = function(req,res){
   var getPath = this.getPath;
   var findNodeModule = this.findNodeModule;
   var mongodb = require(findNodeModule('mongodb'));
   var conf = require(path.join(getPath('sitewm'),'dbconfig.json'));
   var db = new mongodb.Db(conf.dbname,
      new mongodb.Server(conf.host,conf.port,{}),{safe:false});
   db.open(function(e, db){
      db.collection('images',function(e,collection){
         var query = req.query;
         collection.find({_id:mongodb.ObjectID(String(query._id))},{},
               function(e,cursor){
            cursor.toArray(function(e,items){
               if (items && items.length > 0){
                  res.set({
                    'Accept-Ranges':'bytes',
                    'Content-Type': items[0].type
                  });
                  res.send(200,new Buffer(items[0].base64, 'base64'));
               } else res.sendfile(path.join(
                  getPath('site'),'img','noimage.png'
               ));
               db.close();
            });
         });
      });
   });
   return true;
};