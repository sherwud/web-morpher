"use strict";
var path = wm.ext.path;
var dir = 'E:/Музыка';
exports = module.exports = function(server){
   server.app.use(server.express.directory(dir));
   server.app.get('/*',function(req,res){
      var file = path.normalize(path.join(dir,req.url));
      res.sendfile(file);
      var str = (new Buffer(unescape(req.url),'ascii')).toString();
      console.log(req.socket.remoteAddress,str);
   });
};
