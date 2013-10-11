"use strict";
var fs = require('fs');
var path = require('path');
var config = require('./log.json');
config.logFilesRoot = config.logFilesRoot || './';
config.stackTraceLimit = config.stackTraceLimit || 15;
Error.stackTraceLimit = config.stackTraceLimit;
function DateToString(date,rev,istime,isdate){
   var sdate = '';
   date = date?date:new Date;
   istime = (typeof istime !== 'undefined') ? istime : true;
   isdate = (typeof isdate !== 'undefined') ? isdate : true;
   if (isdate || !istime) {
      var y = date.getFullYear();
      var m =   ('0' +(date.getMonth()+1)   ).slice(-2);
      var d =   ('0' +date.getDate()        ).slice(-2);
      sdate = rev?(y+'.'+m+'.'+d):(d+'.'+m+'.'+y);
   }
   if (istime) {
      var h =   ('0' +date.getHours()       ).slice(-2);
      var min = ('0' +date.getMinutes()     ).slice(-2);
      var sec = ('0' +date.getSeconds()     ).slice(-2);
      var ms =  ('00'+date.getMilliseconds()).slice(-3);
      sdate += sdate?(' '+h+':'+min+':'+sec+':'+ms):(h+':'+min+':'+sec+':'+ms);
   }
   return sdate;
}
function AbstractToString(obj,l){
   if (typeof obj !== 'object' && typeof obj !== 'function')
      return obj+'';
   if (obj.__isProxy) obj = obj.__getThis;
   if (typeof obj === 'function') return '[function]';
   else if (obj instanceof Error) return ErrorToString(obj);
   else if (typeof obj !== 'object'){
      return obj+'';
   } else {
      var space = '';
      for (var i=0; i<l; i++){space+='   ';}
      l+=1;
      var ds = '{';
      var de = '}';
      if (obj instanceof Array) {ds = '['; de = ']';};
      var str = ds+'\n';
      for (i in obj) {
         if (obj[i] && obj[i].__isProxy) {
            if (l<5)
               str+=space+i+': '+AbstractToString(obj[i],l)+'\n';
            else
               str+=space+i+': [Proxy]\n';
         } else {
            var val;
            switch (typeof obj[i]) {
               case 'string': val = '\''+obj[i]+'\''; break;
               case 'function': val = '[function]'; break;
               case 'object':
                  if (l<5)
                     val = AbstractToString(obj[i],l);
                  else {
                     var type = typeof obj[i];
                     if (obj[i] instanceof Array) type = 'Array';
                     if (obj[i] instanceof Error) type = 'Error';
                     val = '['+type+']';
                  }
               break;
               default: val = obj[i]+'';
            }
            str+=space+i+': '+val+'\n';
         }
      }
      str+=space.substr(0,space.length-3)+de;
      return str;
   }
}
function ErrorToString(err){
   return AbstractToString({
      name:err.name,
      code:err.code,
      type:err.type,
      stack:err.stack
   },1);
}
function logCode(code){
   return config.logCode[code]
      || config.logCode[config.defaultLogCode]
      || {type: 'UNDEFINED ERROR ' + code};
}
function appendFile(logPrm,msg){
   function mkdir(fPath,callback){
      var dir = path.dirname(fPath);
      fs.exists(dir,function(exists){
         if (exists){
            callback();
         } else {
            mkdir(dir,function(){
               fs.mkdir(dir,function(){ callback(); });
            });
         }
      });
   }
   function mkdirSync(fPath){
      var dir = path.dirname(fPath);
      if (!fs.existsSync(dir)){
         mkdirSync(dir);
         fs.mkdirSync(dir);
      }
   }
   msg += '\n';
   if (!config.glueFileMessages) msg += '\n';
   var fPath = logPrm.path;
   if (logPrm.DateInPath) {
      fPath = path.join(
         config.logFilesRoot,
         path.dirname(fPath),
         path.basename(fPath,path.extname(fPath))
            +'_'+DateToString(0,1,0)
            +path.extname(fPath)
      );
   }
   if (logPrm.sync) {
      mkdirSync(fPath);
      fs.appendFileSync(fPath,msg);
   } else {
      mkdir(fPath,function(){
         fs.appendFile(fPath,msg);
      });
   }
}
exports = module.exports = function(msg,prm){
   if (!msg) return msg;
   prm = prm || {};
   var code = String(prm.code);
   var logPrm = logCode(code);
   if (logPrm.hide) return;
   var title = (prm.title ? (prm.title+' - ') : '');
   var type = logPrm.type+': ';
   if (msg && msg.__isProxy) msg = msg.__getThis;
   if (typeof msg === 'object') msg = AbstractToString(msg,1);
   msg = type+title+msg;
   if (logPrm.inFile) {
      msg = DateToString(0,0,1,0) + ' ' + msg;
      appendFile(logPrm,msg);
   } else {
      msg = DateToString() + ' ' + msg;
      if (!config.glueDisplayMessages) console.log('');
      console.log(msg);
   }
};
exports.init = function(prm){
   prm = prm || {};
   return function(code,msg){
      prm.code = code;
      return exports(msg,prm);
   };
};
exports.set_logFilesRoot = function(root){
   config.logFilesRoot = root || config.logFilesRoot;
};