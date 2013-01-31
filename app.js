/* инициализация Web morpher */
var wmConstructor = require('./web-morpher');
console.log('Параметры запуска:');
console.log(wmConstructor.startArgs);
console.log('Информация о сервере:');
console.log(wmConstructor.info);
var demo = wmConstructor({path:'./demo/'});
var docs = wmConstructor({path:'./docs/',port:777});
demo.start();
docs.start();
/*
console.log('wm');
console.log(wm);
*/
/*
console.log('ГЛОБАЛ');
console.log(global);
*/