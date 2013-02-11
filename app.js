/* инициализация Web morpher */
var wmConstructor = require('./web-morpher');
var wm = wmConstructor({path:'docs',port:777});
wm.start();
