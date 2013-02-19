var $wm = (typeof $wm !== 'undefined' ? $wm : {});
if (typeof window !== 'undefined') {
   $wm.parser = {};
} else {
   $wm.parser = exports = module.exports;
   $wm.loder = require('../lib/parserLoder.js');
}
/* Версяи парсера */
$wm.parser.version = '0.0.0';
/*
 * data - данные json для преобразования
 * res - контейнер для ответа
 * 
 */
$wm.parser.build = function(data,res,html){
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