"use strict";
global.wm = require('./lib')({
   config: require('./config.js'),
   log: require('./log.js'),
   app: app
});
/*
 * @info Выполняет запуск системы по переданным параметрам
 * @param {string/object} param - параметры запуска
 * @returns {object} - объект для управления системой
 */
function app(param){
   wm.path;
   wm.selflog();
};
