"use strict";
var path = wm.ext.path;
exports = module.exports = function(server){
   server.app.get('/',function(req,res){
      var file = path.normalize(req.query.file);
      var test = file.split(path.sep);
      if (test[0]==='E:' && test[1]==='Музыка'){
         res.sendfile(file);
      } else {
         res.send(403,'Доступ запрещен');
      }
   });
};
