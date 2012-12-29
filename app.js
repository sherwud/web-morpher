/* инициализация Web morpher */
var wmConstructor = require('./web-morpher');
console.log('Параметры запуска:');
console.log(wmConstructor.startArgs);
console.log('Информация о сервере:');
console.log(wmConstructor.info);
var wm = wmConstructor();
wm.start()
/*
console.log('ГЛОБАЛ');
console.log(global);
*/