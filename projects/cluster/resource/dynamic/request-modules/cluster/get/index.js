var cluster = wm.modules.cluster;
module.exports = {
   test1: cluster.test1,
   test2old: cluster.test2,
   test3: cluster.test3,
   md5: cluster.md5,
   test:function(){
      return "test web_handlers.get OK";
   }
};