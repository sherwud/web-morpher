var $wm = (typeof $wm !== 'undefined' ? $wm : {});
if (typeof window !== 'undefined') {
   $wm.parser = $wm.parser || {};
} else {
   $wm.parser = exports = module.exports;
   $wm.parser.loder = require('../lib/parserLoder.js');
}
/* Версяи парсера */
$wm.parser.version = '0.0.0';
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
      callback('Ошибка вызова метода: parser.build');
      return;
   }
   $wm.parser.loder.getPage.call(this,path,function(e,data,cachePage){
      if (e) { callback(e); }
      else {
         if (typeof data === 'string') callback(0,data);
         else {
            var inputParams = params.inputParams;
            $wm.parser.buildPage(data,inputParams,function(e,html){
               if (e) { callback(e); }
               else {
                  var template = data.config.template;
                  if (params.useTemplate && typeof template === 'object'){
                     $wm.parser.setTemplate(template,inputParams,html,
                        function(e,data){
                           if (e) { callback(e); }
                           else {
                              cachePage(data,'get');
                              callback(0,data);
                           }
                        }
                     );
                  } else {
                     cachePage(html,'post');
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
         if (typeof data === 'string') callback(0,data.replace(/{\$page\$}/,html));
         else {
            if (typeof params.input === 'object')
               for (var i in params.input){
                  inputParams[i] = params.input[i];  
               }
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
      callback('Ошибка вызова метода: parser.buildPage');
      return;
   }
   if (typeof data.body !== 'string') 
      callback('parser.buildPage: data.body не является string');
   var reg = /{{(\w+)}}/;
   var regAll = /{{(\w+)}}/g;
   var removeKey = function (callback){
      data.body = data.body.replace(reg,'');
      replaceKey(callback);
   };
   var replaceKey = function (callback) {
      var key = reg.exec(data.body);
      if (key === null) { callback(0,data.body); }
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
                  $wm.parser.buildObject(val,inputParams,function(e,val){
                     if (e) { callback(e); }
                     else {
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
   replaceKey(function(e,html){
      if (e) { callback(e); }
      else { callback(0,html); }
   });
};
/* Строит объекты описанные в параметрах страницы
 * data - данные объекта
 * inputParams - входные(пользовательские) параметры
 * callback - функция для передачи результатов
 */
$wm.parser.buildObject = function(data,inputParams,callback){
   if (typeof data.format === 'undefined' || typeof data.type === 'undefined'
   || typeof data.name === 'undefined'){
      callback('Ошибка вызова метода: parser.buildObject');
      return;
   }
   var val = '';
   switch (data.format){
      case 'input':
         val = inputParams[data.name];
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
      default: callback(0,val);
   }
};