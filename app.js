/* инициализация Web morpher */
var wmConstructor = require('./web-morpher');
console.log('Параметры запуска:');
console.log(wmConstructor.startArgs);
console.log('Информация о сервере:');
console.log(wmConstructor.info);
var wm = wmConstructor();
var wm1 = wmConstructor({path:'../docs/',port:777});
wm.start();
wm1.start();
/*
console.log('wm');
console.log(wm);
*/
/*
console.log('ГЛОБАЛ');
console.log(global);
*/