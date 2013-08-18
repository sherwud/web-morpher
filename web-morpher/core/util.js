var fs = wm.ext.fs;
var path = wm.ext.path;
exports = module.exports = {isProxy:true};
exports.DateToString = DateToString;
exports.fsCopySync = fsCopySync;
exports.fsRemoveSync = fsRemoveSync;
exports.fsClearSync = fsClearSync;
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
function fsCopySync(srcpath, dstpath){
   if (!fs.existsSync(dstpath)) fs.mkdirSync(dstpath);
   var list = fs.readdirSync(srcpath);
   for(var i = 0; i < list.length; i++) {
      var src = path.join(srcpath, list[i]);
      var dst = path.join(dstpath, list[i]);
      var current = fs.lstatSync(src);
      if(current.isDirectory()) {
         fsCopySync(src, dst);
      } else if(current.isSymbolicLink()) {
         var symlink = fs.readlinkSync(src);
         fs.symlinkSync(symlink, dst);
      } else {
         var r = fs.createReadStream(src);
         var w = fs.createWriteStream(dst);
         r.pipe(w);
      }
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