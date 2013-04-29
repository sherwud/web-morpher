/* пробник модуля */
/* стандартные модули */
var path = require('path');
/* локальные переменные */
var  a = 1;
/* локальные функции */
function b (x){
   return a++;
}
/* объявление exports */
exports = module.exports = {};
/* функции для экспорта */
exports.tt = function(){
   console.log(this);
};