var path = require('path');
exports = module.exports = {};
/*
 * @info Обрезает переданную часть пути, слева
 * @param {string} full - полный путь
 * @param {string} cut - обрезаемая часть
 * @returns {string} - относительный путь
 */
exports.cutDirL = function(full,cut){
   var re = new RegExp(cut);
   return full.replace(re,'');
};