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
            $wm.parser.buildPage(data,function(e,data){
               if (e) { callback(e); }
               else {
                  callback(0,data);
               }
            });
            
            /*
            var template = data.config.template;
            if (params.useTemplate && typeof template === 'object') {
               $wm.parser.buildTemplate(template,function(e,data){
                  if (e) { callback(e); }
                  else {
                     callback(0,data);
                  }
               })
            } else {
               callback('недописанно =)');
            }
            */
         }
      }
   });
};
$wm.parser.buildTemplate = function(data,callback){
   if (typeof data.name !== 'string' || typeof callback !== 'function') {
      callback('Ошибка вызова метода: parser.buildTemplate');
      return;
   }
   $wm.parser.loder.getPage.call(this,path,function(e,data){
      if (e) { callback(e); }
      else {
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
 * Тестировать в интерфейсе:
 * 
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
   var loopsChecker = [];
   var replace = function (html,callback) {
      var key = reg.exec(html);
      if (key === null) { callback(0,html); }
      else {
         if (loopsChecker.indexOf(key[1]) === -1) {loopsChecker.push(key[1])}
         else { callback('parser.buildPage: цикл в ключе: '+key[1]); return; }
         var val = data[key[1]];
         switch (typeof val) {
            case 'string':
               
               replace(val,function(e,rhtml){
                  if (e) { callback(e); }
                  else {
                     val = val.replace(reg,rhtml)
                     callback(0,html.replace(reg,rhtml));
                  }
               });
               
            break;
            default: callback(0,'');
         }
      }
   };
   replace(data.body,function(e,html){
      if (e) { callback(e); }
      else { callback(0,html); }
   });
   
   
   
   /*
  
                 replace(val,function(e,rhtml){
                  if (e) { callback(e); }
                  else {
                     html = html.replace(reg,rhtml);
                     replace(html,function(e,rhtml){
                        if (e) { callback(e); }
                        else { callback(0,rhtml); }
                     });
                  }
               });
    */
   
   
   //callback(0,html);
   

   //reg.exec(data.body);
   //data.body = data.body.replace(reg,'1 ok')
};