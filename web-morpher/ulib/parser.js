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
$wm.parser.build = function(data,res){
   if (typeof data === 'undefined' || !data instanceof Object) return undefined;
   
   $wm.loder.getJSON(data[0],function(json){
      res.send(json);
   });
};