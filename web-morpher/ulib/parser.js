var $wm = (typeof $wm !== 'undefined' ? $wm : {});
if (typeof window !== 'undefined') {
   $wm.parser = $wm.parser || {};
   $wm.parser.server = false;
} else {
   $wm.parser = exports = module.exports;
   $wm.parser.server = true;
   $wm.parser.loder = require('../lib/parserLoder.js');
}
/* Версяи парсера */
$wm.parser.version = '0.0.0';
/* Генератор идентефикаторов элементов */
$wm.parser.idGen = {
   PID: 0,CID: 0,
   getPID: function(){
      var PID = $wm.parser.idGen.PID;
      $wm.parser.idGen.PID+=1;
      return String(Number($wm.parser.server))+PID;
   },
   getCID: function(){
      var CID = $wm.parser.idGen.CID;
      $wm.parser.idGen.CID+=1;
      return String(Number($wm.parser.server))+CID;
   }
};
/* Строит страницу по пути к файлу
 * path - путь к странице
 * params - входные параметры для построения страницы
 * callback - функция для передачи результатов
 *    callback(e,data)
 *    e - ошибка, 0 если нет ошибки
 *    data - данные для отправки
 */
$wm.parser.build = function(path,params,callback){
   if (typeof path !== 'string' || typeof callback !== 'function'){
      callback('parser.build - ошибка вызова метода');
      return;
   }
   var httpMethod = params.httpMethod;
   $wm.parser.loder.getPage.call(this,path,httpMethod,function(e,data,cache){
      if (e) { callback(e); }
      else {
         if (typeof data === 'string') callback(0,data);
         else {
            var inputParams = params.inputParams;
            $wm.parser.buildPage(data,inputParams,function(e,html){
               if (e) { callback(e); }
               else {
                  var tmpl = data.config.template;
                  if (httpMethod === 'get' && typeof tmpl === 'object'){
                     $wm.parser.setTemplate(tmpl,inputParams,html,
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
            });
         }
      }
   });
};
/* Встраивает шаблон в страницу
 * params - данные для шаблона из страницы
 * inputParams - входные(пользовательские) параметры
 * html - html-код построенной страницы
 * callback - функция для передачи результатов
 */
$wm.parser.setTemplate = function(params,inputParams,html,callback){
   $wm.parser.loder.getTemplate.call(this,params,function(e,data){
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
            $wm.parser.buildPage(data,inputParams,function(e,data){
               if (e) { callback(e); }
               else {
                  callback(0,data.replace(/{\$page\$}/,html));
               }
            });
         }
      }
   });
};
/* Строит страницу или шаблон
 * data - данные json для преобразования
 * inputParams - входные(пользовательские) параметры
 * callback - функция для передачи результатов
 * 
 * Тестировать в интерфейсе:
 * $wm.parser.buildPage($wm.test,function(e,d){ console.log(e||d); })
 * 
 */
$wm.parser.buildPage = function(data,inputParams,callback){
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
                  $wm.parser.buildObject(val,inputParams,function(e,val,js){
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
            js = '$(document).ready(function(){\n'+js+'});';
            /* js надо сохранить а pid передать наверх*/
            console.log(js);
            var nane = data.config.control||'page';
            var system = data.config.system;
            if (typeof system !== 'boolean') system = true;
            var param = data.config.input||{};
            param.html = html;
            param.pid = $wm.parser.idGen.getPID();
            $wm.parser.buildControl(nane,system,param,callback);
         } else { callback(0,html); }
      }
   });
};
/* Строит объекты описанные в параметрах страницы
 * data - данные объекта
 * inputParams - входные(пользовательские) параметры
 * callback - функция для передачи результатов
 */
$wm.parser.buildObject = function(data,inputParams,callback){
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
         $wm.parser.buildControl(data.control,data.system,inputParams,callback);
      break;
      default: callback(0,'');
   }
};
/* Хранилище контролов
 * ключ - числовое значение флага system + имя контрола
 * значение - json представление контрола
 */
$wm.parser.controls = {
   '1page':{
      'body':'<section{{id}} class="wm-page{{class}}">{{html}}</section>'
   },
   '1button':{
      'body':'<button{{id}}{{onclick}} class="wm-button{{class}}">{{text}}</button>',
      'builders':{
         'text':function(k,d){return String(d[k])
            .replace(/</g,'&lt;').replace(/>/g,'&gt;');},
         'onclick':function(k,d){
            return d[k]?(' onclick="'+d[k]+'"'):'';
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
$wm.parser.buildControl = function(name,system,data,callback){
   var reg = /{{(\w+)}}/g;
   var key = Number(system)+name;
   if (key in $wm.parser.controls) {
      var ctrl = $wm.parser.controls[key];
      var html = ctrl.body;
      var cid = false;
      html = html.replace(reg,function(math){
         math = math.replace(reg,'$1');
         var str = '';
         if (ctrl.builders && typeof ctrl.builders[math] === 'function') {
            return ctrl.builders[math].call(ctrl,math,data);
         } else
            switch (math) {
               case 'id':
                  if (data['pid'])
                     str = ' pid="'+data['pid']+'"';
                  else {
                     cid = $wm.parser.idGen.getCID();
                     str = ' cid="'+cid+'"';
                  }
                  if (data[math])
                     str = ' id="'+data[math]+'"'+str;
                  return str;
               break;
               default: return data[math]?(' '+data[math]):'';
            }
      });
      var js = false;
      if (data.handlers && ctrl.handlers && cid) {
         js = '';
         for (var i in data.handlers) {
            if (i in ctrl.handlers) {
               js += "$('#"+cid+ctrl.handlers[i]+"')."
                  +i+"=function(){\n"+data.handlers[i]+'\n}\n';
            }
         }
      }
      callback(0,html,js);
   } else {
      callback('Не найден: '+key+'. Реализовать загрузку контролов из файла.');
   }
};