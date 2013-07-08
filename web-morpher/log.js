"use strict";
function DateToString(date,rev){
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
   if (obj.isProxy) obj = obj.getThis;
   if (typeof obj === 'function') return '[function]';
   else if (typeof obj !== 'object' || obj instanceof Error){
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
         if (obj[i] && obj[i].isProxy) {
            if (l<5)
               str+=space+i+': '+AbstractToString(obj[i],l)+'\n';
            else
               str+=space+i+': [Proxy]\n';
         } else if (typeof obj[i] === 'function')
            str+=space+i+': '+'[function]\n';
         else if (typeof obj[i] !== 'object') str+=space+i+': '
                  +(obj[i]?obj[i]:'\''+obj[i]+'\'')+'\n';
         else if (l<5)
            str+=space+i+': '+AbstractToString(obj[i],l)+'\n';
         else {
            var type = typeof obj[i];
            if (obj[i] instanceof Array) type = 'Array';
            if (obj[i] instanceof Error) type = 'Error';
            str+=space+i+': ['+type+']\n';
         }
      }
      str+=space.substr(0,space.length-3)+de;
      return str;
   }
}
var errorCode = {
   0:'DONE',
   1:'ERROR',
   2:'INFO'
};
exports = module.exports = function(msg,prm){
   if (!msg) return msg;
   prm = prm || {};
   var d = DateToString(new Date)+' ';
   var title = (prm.title ? (prm.title+' ') : '');
   var type = errorCode[prm.type] || 'ERROR';
   if (msg && msg.isProxy) msg = msg.getThis;
   if (typeof msg === 'object')
      msg = AbstractToString(msg,1);
   console.log(type+' '+d+title+'- '+msg);
};