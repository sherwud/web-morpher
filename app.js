/* инициализация Web morpher */
var wmConstructor = require('./web-morpher');
console.log('Параметры запуска:');
console.log(wmConstructor.startArgs);
console.log('Информация о сервере:');
console.log(wmConstructor.info);
var demo = wmConstructor({path:'demo',port:778});
var docs = wmConstructor({path:'docs',port:777});
demo.start();
docs.start();