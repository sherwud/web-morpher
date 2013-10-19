/**
 * @description Глобальный объект web-morpher
 * , обеспечивающий доступ ко всему функционалу системы.
 * @syntax wm
 */
var wm = {
   /**
    * @description Глобальный конфиг системы web-morpher.
    * @syntax wm.config
    */
   config:{}
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
 * @name namePath
 */
var wmabstract = function(modPath,modLogic,critical){};