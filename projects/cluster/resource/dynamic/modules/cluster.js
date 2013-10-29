/* Модуль кластера */
"use strict";
module.exports = {
   test1: test1,
   test2: test2,
   test3: test3,
   md5:md5
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
function md5(req,res){
   var crypto = require('crypto');
   var md5 = crypto.createHash('md5');
   md5.update(req.query.s || '');
   res.send(200,md5.digest('hex'));
}