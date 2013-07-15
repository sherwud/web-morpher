var fs = wm.ext.fs;
var path = wm.ext.path;
/*
 * @info Выполняет запуск системы по переданным параметрам
 * @param {string} way - файл или каталог запуска
 * @returns {object} - объект для управления системой
 */
exports = module.exports = function app(way){
   var logprm = {'title':'function app'};
   if (typeof way !== 'string' && way !== '') {
       wmlog('Файл или каталог запуска не задан!',logprm);
       return;
   }
   if (!fs.existsSync(way)) {
       way = path.join(wm.path.siteroot,way);
       if (!fs.existsSync(way)) {
       wmlog('Файл или каталог запуска не найден!',logprm);
       return;
       }
   }
   var state = fs.statSync(way);
   if (state.isFile()) {
       wmlog('isFile');
   } else {
       wmlog('isDirectory');
   }
   wmlog(way);
   return way||{};
};