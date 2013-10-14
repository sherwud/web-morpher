/* Модуль кластера */
"use strict";
exports = module.exports = {
   test1: test1,
   test2: test2,
   test3: test3
};

function test1(){
   return 'test1 ok';
}
function test2(req,res){
   res.send(200,'test2 ok');
}
function test3(){
   return false;
}