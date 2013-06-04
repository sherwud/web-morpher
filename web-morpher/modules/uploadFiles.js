var path = require('path');
exports = module.exports = {};
/* пока свалка. потом оформлю в модуль */
exports.start = function(){
   var upload = function(){
      app.post('/upload',function(req,res){
         var form = new wm.formidable.IncomingForm();
         //form.uploadDir = path.join(wm.dataWM.path,'~upload');
         //console.log(form);
         form.parse(req, function(err, fields, files) {
            //console.log(files);
            fs.readFile(files.image.path,'base64',function(e, data){
               if (e) console.log(e);
               else {
                  var image = 'data:' + files.image.type + ';base64,'+data;
                  fs.unlink(files.image.path);
                  res.send(200,'<img src="'+image+'"/>');
               }
            });
         });
         /*
         fs.rename(files.image.path, 
            path.join(path.dirname(files.image.path),files.image.name),
            function(err) {
               if (err) {
                  console.log(err);
               }
            }
         );*/
         //console.log(files);
         //res.send(200,'файл загружен!');
      });
   };
};