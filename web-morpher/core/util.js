var fs = wm.ext.fs;
exports = module.exports = {isProxy:true};
exports.DateToString = DateToString;
exports.fsmkdirSync = fsmkdirSync;
exports.fsCopySync = fsCopySync;
exports.fsRemoveSync = fsRemoveSync;
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
function fsmkdirSync(path){
   if (!fs.existsSync(path))
      return fs.mkdirSync(path);
   else return true;
}
function fsCopySync(srcpath, dstpath, options){
   options = !(options instanceof Object)?options:{};
   fsmkdirSync(dstpath);
   var list = fs.readdirSync(srcpath);
   wmlog(list)
   /*
	mkdir(dest);
	var files = fs.readdirSync(src);
	for(var i = 0; i < files.length; i++) {
		var current = fs.lstatSync(path.join(src, files[i]));
		if(current.isDirectory()) {
			copyDir(path.join(src, files[i]), path.join(dest, files[i]));
		} else if(current.isSymbolicLink()) {
			var symlink = fs.readlinkSync(path.join(src, files[i]));
			fs.symlinkSync(symlink, path.join(dest, files[i]));
		} else {
			copy(path.join(src, files[i]), path.join(dest, files[i]));
		}
	}
      */
}
function fsRemoveSync(path, options){
   options = !(options instanceof Object)?options:{};

}