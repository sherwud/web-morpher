"use strict";
exports = module.exports = {};
var spawn = require('child_process').spawn;
/*
 * @info Выполняет запуск системы по переданным параметрам
 * @param {string/object} param - параметры запуска
 * @returns {object} - объект для управления системой
 */
exports.app = function (param){
   let a = 1;
   let exp1 = require('express');
   console.log(a);
   
};
/* @info Проведет тестирование на наличие возможных ошибко
 * 
 */
exports.test = function(){
   var test;
   try{
      test = require('express');
   }catch(e){
      console.log('Модуль "express" не найден!');
      
      var cp = spawn('npm.cmd',['install'],{cwd:'web-morpher'});
      cp.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
      });
      cp.on('close', function (code) {
        console.log('child process exited with code ' + code);
      });
   }
};