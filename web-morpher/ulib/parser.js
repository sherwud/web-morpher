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
 * callback - функция для передачи результатов
 *    callback(e,data)
 *    e - ошибка, 0 если нет ошибки
 *    data - данные для отправки
 */
$wm.parser.build = function(path,params,callback){
   if (typeof path !== 'string' || typeof callback !== 'function') {
      callback('Ошибка вызова метода: parser.build');
      return;
   }
   $wm.parser.loder.getPage.call(this,path,function(e,data){
      if (e) { callback(e); }
      else {
         if (typeof data === 'string') callback(0,data);
         else { /* Парсинг страницы */
            $wm.parser.buildPage(data,function(e,html){
               if (e) { callback(e); }
               else {
                  var template = data.config.template;
                  if (params.useTemplate && typeof template === 'object'){
                     $wm.parser.setTemplate(template,html,callback);
                  } else callback(0,html);
               }
            });
         }
      }
   });
};
/* Встраивает шаблон в страницу
 * params - данные для шаблона из страницы
 * html - html-код построенной страницы
 * callback - функция для передачи результатов
 */
$wm.parser.setTemplate = function(params,html,callback){
   $wm.parser.loder.getTemplate.call(this,params,function(e,data){
      if (e) { callback(e); }
      else {
         callback(0,'С ШАБЛОНОМ "'+params.name+'"'+html)
      }
   });
};
/* Строит страницу или шаблон
 * data - данные json для преобразования
 * callback - функция для передачи результатов
 * 
 * Тестировать в интерфейсе:
 * $wm.parser.buildPage($wm.test,function(e,d){ console.log(e||d); })
 * 
 */
$wm.parser.buildPage = function(data,callback){
   if (typeof data === 'undefined' || !data instanceof Object
         || typeof callback !== 'function') {
      callback('Ошибка вызова метода: parser.buildPage');
      return;
   }
   if (typeof data.body !== 'string') 
      callback('parser.buildPage: data.body не является string');
   var reg = /{{(\w+)}}/;
   var regAll = /{{(\w+)}}/g;
   var replace = function (callback) {
      var key = reg.exec(data.body);
      if (key === null) { callback(0,data.body); }
      else {
         var val = data[key[1]];
         switch (typeof val) {
            case 'string':
               if (val.search(reg) !== -1)
                  data[key[1]] = val = val.replace(regAll,'');
               data.body = data.body.replace(reg,val);
               replace(callback);
            break;
            default:
               data.body = data.body.replace(reg,'');
               replace(callback);
         }
      }
   };
   replace(function(e,html){
      if (e) { callback(e); }
      else { callback(0,html); }
   });
};
