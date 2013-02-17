var $loder = exports = module.exports;
var fs = require('fs');
var path = require('path');
$loder.getJSON = function(name,callback){
   /* добавить типы и загрузку из контролов и страниц */
   var fName = path.join(__dirname,'../ui/controls/',
      path.normalize(name)+'.json');
   fs.stat(fName, function(err, stats){
      if (!err && stats.isFile()){
         fs.readFile(fName,'utf-8', function (err, data) {
            if (!err){
               callback(data);
            } else {
               callback({});
            }
          });
      } else {
         callback({});
      }
   });
};
