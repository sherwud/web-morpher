"use strict";
/* тут можно написать скрипт инициализации сервера 
 * подгрузить необходимые библиотеки
 * подготовить данные
 * запустить выполнение заданий по времени
 * и т.д.
 */
exports = module.exports = function(server){
   /* при инициализации через функцию можно получить доступ
    * к внутренним механизмам модуля сервера
    * Пример добавляет обработчик для get метода
    */
   server.app.get('/init',function(req,res){
      res.send(200,'init test ok!');
   });
};
var modules = wm.modules;
var r_modules = wm['request-modules'];
/* подключаем cluster */
modules.cluster;
/* подключаем get функцию модуля cluster */
r_modules.cluster.get.test2;