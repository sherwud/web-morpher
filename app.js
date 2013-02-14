/* инициализация Web morpher */
var wmConstructor = require('./web-morpher');
var wm = wmConstructor({path:'demo',port:777});
if (wm !== false) wm.start();