exports = module.exports = {};
var spawn = require('child_process').spawn;
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