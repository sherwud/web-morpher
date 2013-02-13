var $wm = (typeof $wm !== 'undefined' ? $wm : {});
if (typeof window !== 'undefined') {
   $wm.parser = {};
} else {
   $wm.parser = exports = module.exports;
   $wm.loder = require('../lib/core.js');
}
/* Версяи парсера */
$wm.parser.version = '0.0.0';
$wm.parser.i=0
/*
 * data - данные json для преобразования
 */
$wm.parser.build = function(data){
   if (typeof data === 'undefined' || !data instanceof Object) return undefined;
   $wm.parser.i+=1;
   return String($wm.parser.i);
};