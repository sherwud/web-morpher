"use strict";
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
Error.stackTraceLimit = 15;
function ErrorToString(err){
   return AbstractToString({
      name:err.name,
      code:err.code,
      type:err.type,
      stack:err.stack
   },1);
}
var errorCode = {
   0:'DONE',
   1:'ERROR',
   2:'INFO',
   3:'SYSTEM'
};
exports = module.exports = function(msg,prm){
   if (!msg) return msg;
   prm = prm || {};
   var d = DateToString(new Date)+' ';
   var title = (prm.title ? (prm.title+' - ') : '');
   var type = (errorCode[prm.type] || errorCode[1])+': ';
   if (msg && msg.__isProxy) msg = msg.__getThis;
   if (typeof msg === 'object') msg = AbstractToString(msg,1);
   console.log(d+type+title+msg);
};