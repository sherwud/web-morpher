/**
 * @description Глобальный объект web-morpher
 * , обеспечивающий доступ ко всему функционалу системы.
 * @syntax wm
 */
var wm = {
   /**
    * @description Выполняет запуск переданного в параметре way проекта.
    * @description Может принимать путь к конфигу проекта,
    * если в проекте используется несколько конфигураций.
    * @syntax wm.app(way,callback)
    * @param {string} way - файл или каталог запуска
    * @param {function} callback функция которая вызовется после запуска сайта
    * @example wm.app('./projects/cluster')
    */
   app:function(way,callback){},
   /**
    * @description Глобальный конфиг системы web-morpher.
    * @syntax wm.config
    */
   config:{},
   util:{
      /**
       * @description Рекурсивная, асинхронная функция удаления дирректории и всего ее содержимого
       * @description Работает в паре с функцией fsClear
       * @syntax fsRemove(./www,function(err){ if(err) {alert(err);} else {alert('ok');} });
       * @param {string} path путь к удаляемой дирректории
       * @param {function} callback функция которую необходимо выполнить после того как отработает fsRemove
       */
      fsRemove:function(path, callback){},
      /**
       * @description Рекурсивная, асинхронная функция удаления дирректории и всего ее содержимого
       * @description Работает в паре с функцией fsRemove
       * @syntax fsRemove(./www,function(err){ if(err) {alert(err);} else {alert('ok');} });
       * @param {string} path путь к удаляемой дирректории
       * @param {function} callback функция которую необходимо выполнить после того как отработает fsClear
       */
      fsClear:function(path, callback){}
   }
};
/**
 * @description Общий системный метод логирования.
 * @description console.log не может логировать объекты класса wmabstract.
 * @syntax wmlog(msg,prm)
 * @param {any} msg
 * @param {Object} prm
 */
var wmlog = function(msg,prm){};
/**
 * @description Конструктор для абстрактных объектов.
 * @syntax newobj = wmabstract(modPath,modLogic,critical)
 * @param {String/Array} modPath путь к файлам модуля
 * @param {String} modLogic логическое расположение объекта
 * @param {Boolean} critical при ошибке: t - кидать throw, f - писать в лог 
 * @return {Object}
 * @example global.wm = wmabstract('./core','wm');
 * @example var myObj.myOpt = wmabstract('./myDir','myObj.myOpt');
 * @example var myObj = wmabstract(['./m1','./m2'],'myObj');
 */
var wmabstract = function(modPath,modLogic,critical){};

