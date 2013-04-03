var $wm = (typeof $wm !== 'undefined' ? $wm : {});
$wm.parser = function($parser,runOnServer){
   var version = '0.0.0';
   $parser.version = function(){return version;};
   /* Генератор id элементов
    * PID - id страницы 
    * CID - id контрола
    */
   var idGen = new function(){
      var PID = 0;
      var CID = 0;
      this.PID = function(){ return String(0+Number(runOnServer))+PID++; };
      this.CID = function(){ return String(2+Number(runOnServer))+CID++; };
   }();
   /* Элементы html
    * get( - получает элементы
    *    name - имя элемента
    *    standard - стандартный элемент
    *    callback(e,data) - функция для передачи результатов
    * )
    */
   var elements = new function(){
      var elements ={};
      this.get = function(name,standard,callback){
         var key = Number(standard)+name;
         if (key in elements){
            callback(0,elements[key]);
         } else {
            $parser.loder.getElement(name,standard,function(e,data){
               if (e) callback(e);
               else {
                  elements[key] = data;
                  callback(0,data);
               }
            });
         }
      };
   }();
   /* Строит элемент
    * name - имя элемента
    * standard - стандартный элемент
    * data - данные для элемента
    * callback(e,data) - функция для передачи результатов
    */
   $parser.element = function(name,standard,data,callback){
      if (typeof callback !== 'function'){
         console.error('$parser.element: "callback" не задан!'); return;
      };
      if (typeof name !== 'string'){
         callback('$parser.element: "name" не задан!'); return;
      };
      elements.get(name,standard,function(e,element){
         if (e) callback(e);
         else {
            var reg = /{{(\w+)}}/;
            var html = element.body;
            var replaceKey = function(callback){
               var key = reg.exec(html);
               if (key === null) callback(0,html);
               else {
                  key = key[1];
                  var val = '';
                  switch (key) {
                     case 'id':
                        val = String(data[key]||'');
                        val = 'id="'+val+'"';
                     break;
                     case 'wmname':
                        val = String(data[key]||'');
                        if (val)
                           val = 'wmname="'+val+'"';
                        else val = '';
                     break;
                     case 'wmtype':
                        val = 'wmtype="element:'+Number(standard)+name+'"';
                     break;
                     case 'class':
                        val = String(data[key]||'');
                        val = val?(' '+val):val;
                        if (val||element.class)
                           val = 'class="'+(element.class||'')+val+'"';
                        else val = '';
                     break;
                     default: val = String(data[key]||'');
                  }
                  
                  html = html.replace(reg,val);
                  setTimeout(function(){replaceKey(callback);},1);
               }
            };
            replaceKey(callback);
         }
      });
   };
   /* Контролы
    * get( - получает элементы
    *    name - имя элемента
    *    standard - стандартный контрол
    *    callback(e,data) - функция для передачи результатов
    * )
    */
   var controls = new function(){
      var controls ={};
      this.get = function(name,standard,callback){
         var key = Number(standard)+name;
         if (key in controls){
            callback(0,controls[key]);
         } else {
            $parser.loder.getСontrol(name,standard,function(e,data){
               if (e) callback(e);
               else {
                  controls[key] = data;
                  callback(0,data);
               }
            });
         }
      };
   }();
   /* Строит контрол
    * 
    */
   $parser.control = function(){};
   /* Строит страницу из json файла
    * data - данные страницы из json
    * inputParams - входные параметры
    * callback(e,data) - функция для передачи результатов
    * setPageJS(pid,js,callback) - функция сохранения скриптов страницы
    */
   $parser.page = function(data,inputParams,callback,setPageJS){
      if (typeof callback !== 'function'){
         console.error('$parser.page: "callback" не задан!'); return;
      }
      if (typeof data === 'undefined' || !data instanceof Object) {
         callback('$parser.page: "data" не задан!'); return;
      }
      if (typeof data.body !== 'string')
         callback('$parser.page: "data.body" не задан!');
      var reg = /{{(\w+)}}/;
      var regAll = /{{(\w+)}}/g;
      var removeKey = function(callback){
         data.body = data.body.replace(reg,'');
         setTimeout(function(){replaceKey(callback);},1);
      };
      var pageJS = '';
      var params = data.params||{};
      var replaceKey = function(callback){
         var key = reg.exec(data.body);
         if (key === null) { callback(0,data.body,pageJS); }
         else {
            var val = params[key[1]];
            switch (typeof val) {
               case 'string':
                  if (val.search(reg) !== -1)
                     params[key[1]] = val = val.replace(regAll,'');
                  data.body = data.body.replace(reg,val);
                  setTimeout(function(){replaceKey(callback);},1);
               break;
               case 'object':
                  if (val instanceof Array) {
                     removeKey(callback);
                  } else {
                     $parser.buildObject(val,inputParams,function(e,val,js){
                        if (e) { callback(e); }
                        else {
                           if (js) pageJS+=js;
                           params[key[1]] = val;
                           data.body = data.body.replace(reg,val);
                           setTimeout(function(){replaceKey(callback);},1);
                        }
                     });
                  }
               break;
               default: removeKey(callback);
            }
         }
      };
      replaceKey(function(e,html,js){
         if (e) callback(e);
         else {
            var config = data.config;
            if (config) {
               var name = config.element||'page';
               var standard = config.standard;
               if (typeof standard !== 'boolean') standard = true;
               var params = config.params||{};
               params.page = html;
               var pid = params.id = idGen.PID();
               $parser.element(name,standard,params,function(e,data){
                  if (e) callback(e);
                  else {
                     if (js) {
                        js = '$(document).ready(function(){'+js+'});';
                        setPageJS(pid,js,function(){
                           callback(0,data,pid);
                        });
                     } else {
                        callback(0,data,pid);
                     }
                  }
               });
            } else { callback(0,html); }
         }
      });
   };   
   
   /* Строит страницу по пути к файлу
    * path - путь к странице
    * params - входные параметры для построения страницы
    * callback - функция для передачи результатов
    *    callback(e,data)
    *    e - ошибка, 0 если нет ошибки
    *    data - данные для отправки
    */
   $parser.build = function(path,params,callback){
      if (typeof path !== 'string' || typeof callback !== 'function'){
         callback('parser.build - ошибка вызова метода');
         return;
      }
      var httpMethod = params.httpMethod;
      $parser.loder.getPage(path,httpMethod,
            function(e,data,cache,setPageJS){
         if (e) { callback(e,data); }
         else {
            var inputParams = params.inputParams;
            $parser.page(data,inputParams,function(e,html,pid){
               if (e) { callback(e); }
               else {
                  var tmpl = data.config.template;
                  if (httpMethod === 'get' && typeof tmpl === 'object'){
                     $parser.setTemplate(tmpl,inputParams,html,pid,
                        function(e,data){
                           if (e) { callback(e); }
                           else {
                              cache(data);
                              callback(0,data);
                           }
                        }
                     );
                  } else {
                     cache(html);
                     callback(0,html);
                  }
               }
            },setPageJS);
         }
      });
   };
   /* Встраивает шаблон в страницу
    * params - данные для шаблона из страницы
    * inputParams - входные(пользовательские) параметры
    * html - html-код построенной страницы
    * pid - идентификатор страницы
    * callback - функция для передачи результатов
    */
   $parser.setTemplate = function(params,inputParams,html,pid,callback){
      $parser.loder.getTemplate(params,function(e,data){
         if (e) { callback(e); }
         else {
            if (typeof data === 'string')
               callback(0,data.replace(/{\$page\$}/,html));
            else {
               if (typeof params.input === 'object')
                  for (var i in params.input){
                     inputParams[i] = params.input[i];
                  }
               delete params.input;
               $parser.buildPage(data,inputParams,function(e,data){
                  if (e) { callback(e); }
                  else {
                     var script =
                        '<script type="text/javascript" src="{{src}}"></script>';
                     data = data.replace(/{\$coreScript\$}/,
                        script.replace(/{{src}}/,'web-morpher/ui/ext/jquery.js')
                       +script.replace(/{{src}}/,'web-morpher/ui/core.js')
                     );
                     if (pid)
                        data = data.replace(/{\$pageScript\$}/,
                           script.replace(/{{src}}/,'js/'+pid+'.js')
                              .replace(/(<script)/,'$1 id="pageScript"')
                        );
                     else data = data.replace(/{\$pageScript\$}/,'');
                     data = data.replace(/{\$page\$}/,html);
                     callback(0,data);
                  }
               });
            }
         }
      });
   };
   /* Строит страницу или шаблон
    * data - данные json для преобразования
    * inputParams - входные(пользовательские) параметры
    * setPageJS - функция для сохранения js кода для страницы
    * callback - функция для передачи результатов
    */
   $parser.buildPage = function(data,inputParams,callback,setPageJS){
      if (typeof data === 'undefined' || !data instanceof Object
            || typeof callback !== 'function') {
         callback('parser.buildPage - ошибка вызова метода');
         return;
      }
      if (typeof data.body !== 'string') 
         callback('parser.buildPage - data.body не является string');
      var reg = /{{(\w+)}}/;
      var regAll = /{{(\w+)}}/g;
      var removeKey = function (callback){
         data.body = data.body.replace(reg,'');
         replaceKey(callback);
      };
      var alljs = '';
      var replaceKey = function (callback) {
         var key = reg.exec(data.body);
         if (key === null) { callback(0,data.body,alljs); }
         else {
            var val = data[key[1]];
            switch (typeof val) {
               case 'string':
                  if (val.search(reg) !== -1)
                     data[key[1]] = val = val.replace(regAll,'');
                  data.body = data.body.replace(reg,val);
                  replaceKey(callback);
               break;
               case 'object':
                  if (val instanceof Array) {
                     removeKey(callback);
                  } else {
                     $parser.buildObject(val,inputParams,function(e,val,js){
                        if (e) { callback(e); }
                        else {
                           if (js) alljs+=js;
                           data[key[1]] = val;
                           data.body = data.body.replace(reg,val);
                           replaceKey(callback);
                        }
                     });
                  }
               break;
               default: removeKey(callback);
            }
         }
      };
      replaceKey(function(e,html,js){
         if (e) { callback(e); }
         else {
            if (data.config) {
               var nane = data.config.control||'page';
               var system = data.config.system;
               if (typeof system !== 'boolean') system = true;
               var param = data.config.input||{};
               param.html = html;
               var pid = param.pid = idGen.PID();
               if (js) {
                  $parser.buildControl(nane,system,param,function(e,html,pjs){
                     js = '$(document).ready(function(){'+js+(pjs?pjs:'')+'});';
                     setPageJS(pid,js,function(){
                        callback(0,html,pid);
                     });
                  });
               } else
                  $parser.buildControl(nane,system,param,callback);
            } else { callback(0,html); }
         }
      });
   };
   /* Строит объекты описанные в параметрах страницы
    * data - данные объекта
    * inputParams - входные(пользовательские) параметры
    * callback - функция для передачи результатов
    */
   $parser.buildObject = function(data,inputParams,callback){
      if (typeof data.format !== 'string'){
         callback('parser.buildObject - не задан формат объекта');
         return;
      }
      var mergeInputParams = function(){
         if (typeof data.data === 'object' && !(data.data instanceof Array))
            for (var i in data.data){
               inputParams[i] = data.data[i];
            }
         delete data.input;
      };
      switch (data.format){
         case 'input':
            if (typeof data.name !== 'string')
               callback('parser.buildObject - не задано имя входного параметра');
            data.type = data.type || 'text';
            var val = inputParams[data.name];
            switch (data.type) {
               case 'text':
                  val = String(val||'').replace(/</g,'&lt;').replace(/>/g,'&gt;');
               break;
               case 'number':
                  val = Number(val);
               break;
               default: val = '';
            }
            callback(0,val);
         break;
         case 'control':
            mergeInputParams();
            if (typeof data.system !== 'boolean') data.system = true;
            $parser.buildControl(data.control,data.system,inputParams,callback);
         break;
         default: callback(0,'');
      }
   };
   /* Хранилище контролов
    * ключ - числовое значение флага system + имя контрола
    * значение - json представление контрола
    */
   $parser.controls = {
      '1page':{
         'body':'<section class="wm-page{{class}}">{{html}}</section>'
      },
      '1button':{
         'body':'<button {{onclick}} class="wm-button{{class}}">{{text}}</button>',
         'builders':{
            'text':function(k,d){return String(d[k])
               .replace(/</g,'&lt;').replace(/>/g,'&gt;');},
            'onclick':function(k,d){
               return d[k]?('onclick="'+d[k]+'"'):'';
            }
         },
         'handlers':{
            'click':''
         }
      },
      '1scriptList':{
         'body':'{{scripts}}',
         'builders':{
            'scripts':function(k,d){
               var a = d[k]||[];
               if (d['inputscripts'] instanceof Array)
                  a = a.concat(d['inputscripts']);
               return '<script type=\"text/javascript\" src=\"'
               + a.join('\"></script><script type=\"text/javascript\" src=\"')
               + '\"></script>';
            }
         }
      },
      '1styleList':{
         'body':'{{styles}}',
         'builders':{
            'styles':function(k,d){
               var a = d[k]||[];
               if (d['inputstyles'] instanceof Array)
                  a = a.concat(d['inputstyles']);
               return '<link rel=\"stylesheet\" href=\"'
               + a.join('\"/><link rel=\"stylesheet\" href=\"')
               + '\"/>';
            }
         }
      }
   };
   /* Строит контрол
    * name - имя контрола
    * system - тип контрола (true - системный,false - пользовательский)
    * data - входные данные для контрола
    * callback - функция для передачи результатов
    */
   $parser.buildControl = function(name,system,data,callback){
      var reg = /{{(\w+)}}/g;
      var key = Number(system)+name;
      if (key in $parser.controls) {
         var ctrl = $parser.controls[key];
         var html = ctrl.body;
         var cid = false;
         html = html.replace(/(<\w+\s)/,function(math){
            var id = data['pid'];
            if (!id) { id = cid = idGen.CID(); }
            var val = math+'id="'+id+'"';
            if (data['wmname'])
               val += 'wmname="'+data['wmname']+'"';
            val += 'type="'+(data['pid']?'page':('control:'+key))+'"';
            return val+' ';
         });
         html = html.replace(reg,function(math){
            math = math.replace(reg,'$1');
            if (ctrl.builders && typeof ctrl.builders[math] === 'function') {
               return ctrl.builders[math].call(ctrl,math,data);
            } else
               return data[math]||'';
         });
         var js = false;
         if (data.handlers && ctrl.handlers && cid) {
            js = '';
            for (var i in data.handlers) {
               if (i in ctrl.handlers) {
                  js += '$(\'#'+cid+ctrl.handlers[i]+'\').'
                     +i+"(function(){"+data.handlers[i]+'});';
               }
            }
         }
         callback(0,html,js);
      } else {
         callback('Не найден: '+key+'. Реализовать загрузку контролов из файла.');
      }
   };
   /* завершение создания парсера */
   return $parser;
};
if (typeof window === 'undefined') {
   $wm.parser = $wm.parser(exports = module.exports,true);
} else {
   $wm.parser = $wm.parser({},false);
};
