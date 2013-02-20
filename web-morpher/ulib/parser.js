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
$wm.parser.build = function(path,callback){
   if (typeof path !== 'string' || typeof callback !== 'function') {
      callback('Ошибка вызова метода');
      return;
   }
   $wm.parser.loder.getPage.call(this,path,function(e,data){
      if (e) {
         callback(e);
      } else {
         if (typeof data === 'string') callback(0,data);
         else { /* Парсинг страницы */
            callback(0,data);
         }
      }
   });
};



/* Строит страницу
 * data - данные json для преобразования
 * res - контейнер для ответа
 * 
 */
$wm.parser.buildPage = function(data,res,html){
   if (typeof data === 'undefined' || !data instanceof Object) return undefined;
   if (typeof data.body !== 'string') return undefined;
   var reg = /{(\w*){(\w+)}}/;
   if (typeof html !== 'string') {
      html = data.body;
   }
   reg.exec(data.body);
   data.body = data.body.replace(reg,'1 ok')
   
   
   res.send(html);
   
   $wm.loder.getJSON(data,function(json){
      res.send(json);
   });
};