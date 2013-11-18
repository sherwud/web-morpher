var fs = wm.ext.fs;
var path = wm.ext.path;
var __util = module.exports = {__isProxy:true};
__util.DateToString = DateToString;
__util.pathReduce = pathReduce;
__util.fsCopy = fsCopy;
__util.fsRemoveSync = fsRemoveSync;
__util.fsClearSync = fsClearSync;
__util.fsRemove = fsRemove;
__util.fsClear = fsClear;
__util.typeis = typeis;
__util.generateUUID = generateUUID;
function DateToString(date,rev){
   date = date?date:new Date;
   var y = date.getFullYear();
   var m =   ('0' +(date.getMonth()+1)   ).slice(-2);
   var d =   ('0' +date.getDate()        ).slice(-2);
   var h =   ('0' +date.getHours()       ).slice(-2);
   var min = ('0' +date.getMinutes()     ).slice(-2);
   var sec = ('0' +date.getSeconds()     ).slice(-2);
   var ms =  ('00'+date.getMilliseconds()).slice(-3);
   date = rev?(y+'.'+m+'.'+d):(d+'.'+m+'.'+y);
   return date+' '+h+':'+min+':'+sec+':'+ms;
}
function pathReduce(str,len,space){
   if (typeof str !== 'string') return str;
   len = len ? Number(len) / 2 ^ 0 : 32;
   space = (typeof space !== 'undefined') ? space : true;
   var flen = len*2+3;
   if (str.length > flen)
      return str.substr(0,len)+'...'+str.substr(-len,len);
   else {
      if (space) {
         var spc = '';
         for (var i = 0; i < (flen-str.length); i++){
            spc += ' '; 
         }
         return str + spc;
      }
      return str;
   }
}
function fsCopy(src, dst, callback){
   var wmlog = global.wmlog.init({'title':'wm.util.fsCopy'});
   function copyDir(){
      function copyList(){
         var item = list.shift();
         if (typeof item === 'undefined') return callback();
         fsCopy(path.join(src, item), path.join(dst, item), copyList);
      }
      if (!fs.existsSync(dst)) fs.mkdirSync(dst);
      wmlog(3,pathReduce(src)+' -> '+pathReduce(dst));
      var list = fs.readdirSync(src);
      copyList();
   }
   function copyFile(){
      var r = fs.createReadStream(src);
      var w = fs.createWriteStream(dst);
      r.pipe(w).on('finish', function() {
         wmlog(3,pathReduce(src)+' -> '+pathReduce(dst));
         callback();
      });
   }
   function copyLink(){
      var symlink = fs.readlinkSync(src);
      fs.symlinkSync(symlink, dst);
      wmlog(3,pathReduce(src)+' -> '+pathReduce(dst));
      callback();
   }
   var current = fs.lstatSync(src);
   if(current.isDirectory()) {
      copyDir();
   } else if(current.isSymbolicLink()) {
      copyLink();
   } else {
      copyFile();
   }
}
function fsRemoveSync(rempath){
   fsClearSync(rempath);
   fs.rmdirSync(rempath);
}
function fsClearSync(rempath){
   var list = fs.readdirSync(rempath);
   for(var i = 0; i < list.length; i++) {
      var rem = path.join(rempath, list[i]);
      var current = fs.statSync(rem);
      if(current.isDirectory()) {
         fsClearSync(rem);
         fs.rmdirSync(rem);
      } else {
         fs.unlinkSync(rem);
      }
   }
}
function fsRemove(path, callback) {
   fs.stat(path, function(err, stats) {
      if (err) { callback(err); }
      else if (stats.isFile()) {
         fs.unlink(path, function(err){
            if (err) { callback(err); }
            else { callback() }
         });
      }
      else {
         fsClear(path, function(err){
            if (err) { callback(err); }
            else {
               fs.exists(path, function(isit){
                  if(isit) {
                     fs.rmdir(path, function(err){
                        if(err) { callback(err); }
                        else { callback() }
                     });
                  }
                  else {
                     callback();
                  }
               });
            }
         });
      }
   });
}
function fsClear(rempath, callback){
   var i = 0;
   fs.readdir(rempath, function(err, files) {
      if (err) { callback(err) }
      else {
         if(files.length > 0) {
            for (var key in files) {
               var path = rempath + '/' + files[key];
               fsRemove(path, function(err){
                  if (err) { callback(err);}
                  else {
                     i++;
                     if(i==files.length) {callback();}
                  }
               });
            }
         } else {
            fs.rmdir(rempath, function(err){
               if(err) { callback(err); }
               else { callback() }
            });
         }
      }
   });
}
function typeis(value,type){
   if (typeof value === type
         || value && value.__isProxy && typeof value.__getThis === type)
      return true;
   else
      return false;
}
function generateUUID(){
   var d = new Date().getTime();
   var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
   .replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c==='x' ? r : (r&0x7|0x8)).toString(16);
   });
   return uuid;
};