/* Модуль кластера */
exports = module.exports = {};
exports.test1 = test1;
exports.test2 = test2;
exports.test3 = test3;
function test1(){
   return 'ok';
}
function test2(req,res){
   res.send(200,'ok');
}
function test3(){
   return false;
}