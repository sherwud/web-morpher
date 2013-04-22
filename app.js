/* инициализация Web morpher */
var $wm = require('./web-morpher');
console.log($wm.info());
var demo = $wm.app('demo');
demo.listen(777);