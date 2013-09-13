"use strict";
var fs = require('fs');
var config = require('./log.json');
Error.stackTraceLimit = config.stackTraceLimit;
function DateToString(date,rev,istime){
   date = date?date:new Date;
   istime = (typeof istime !== 'undefined') ? istime : true;
   var y = date.getFullYear();
   var m =   ('0' +(date.getMonth()+1)   ).slice(-2);
   var d =   ('0' +date.getDate()        ).slice(-2);
   if (istime) {
      var h =   ('0' +date.getHours()       ).slice(-2);
      var min = ('0' +date.getMinutes()     ).slice(-2);
      var sec = ('0' +date.getSeconds()     ).slice(-2);
      var ms =  ('00'+date.getMilliseconds()).slice(-3);
   }
   date = rev?(y+'.'+m+'.'+d):(d+'.'+m+'.'+y);
   return (istime?(date+' '+h+':'+min+':'+sec+':'+ms):date);
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
exports = module.exports = function(msg,prm){
   if (!msg) return msg;
   prm = prm || {};
   var code = String(prm.type);
   var logPrm = logCode(code);
   if (logPrm.hide) return;
   var date = DateToString()+' ';
   var title = (prm.title ? (prm.title+' - ') : '');
   var type = logPrm.type+': ';
   if (msg && msg.__isProxy) msg = msg.__getThis;
   if (typeof msg === 'object') msg = AbstractToString(msg,1);
   msg = date+type+title+msg;
   if (logPrm.inFile) {
      fs.appendFile(logPrm.path,msg+'\n');
      //msg = 'inFile '+DateToString(0,1,0)+' - '+msg;
      //console.log(msg);
   } else
      console.log(msg);
};