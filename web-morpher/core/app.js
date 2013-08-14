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
   if (way[0] === '.') {
      way = path.join(wm.path.startupdir,way);
   }
   if (!fs.existsSync(way)) {
       wmlog('Файл или каталог запуска "'+way+'" не найден!',logprm);
       return;
   }
   var config;
   if (fs.statSync(way).isDirectory()) {
      config = way+'/config.json';
      try {
         var config = require(config);
      } catch (e){
         wmlog('Файл "'+config+'"!',logprm);
         wmlog(e,logprm);
         return;
      }
      wm.builder.deploy(way,config);
      
      //wmlog(config,logprm);
   } else {
       wmlog('way isFile',logprm);
       return;
   }
   return way||{};
};