var fs = wm.ext.fs;
var path = wm.ext.path;
exports = module.exports = {__isProxy:true};
exports.DateToString = DateToString;
exports.pathReduce = pathReduce;
exports.fsCopy = fsCopy;
exports.fsRemoveSync = fsRemoveSync;
exports.fsClearSync = fsClearSync;
exports.typeis = typeis;
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
function fsCopy(srcpath, dstpath, callback){
   function copyList(list,callback){
      var item = list.shift();
      if (typeof item === 'undefined') return callback();
      var src = path.join(srcpath, item);
      var dst = path.join(dstpath, item);
      var current = fs.lstatSync(src);
      if(current.isDirectory()) {
         fsCopy(src, dst, function(){
             wmlog('copied: '+pathReduce(src)+' -> '+pathReduce(dst),{type:0});
             copyList(list,callback);
         });
      } else if(current.isSymbolicLink()) {
         var symlink = fs.readlinkSync(src);
         fs.symlinkSync(symlink, dst);
         copyList(list,callback);
      } else {
         var r = fs.createReadStream(src);
         var w = fs.createWriteStream(dst);
         r.pipe(w).on('finish', function() {
            wmlog('copied: '+pathReduce(src)+' -> '+pathReduce(dst),{type:0});
            copyList(list,callback);
         });
      }
   }
   if (!fs.existsSync(dstpath)) fs.mkdirSync(dstpath);
   var list = fs.readdirSync(srcpath);
   try{
      copyList(list, callback);
   }catch(e){
      callback(e);
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
function typeis(value,type){
   if (typeof value === type
         || value && value.__isProxy && typeof value.__getThis === type)
      return true;
   else
      return false;
}