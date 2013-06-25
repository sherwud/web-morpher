"use strict";
function toString(date,rev){
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
exports = module.exports = function(e){
   if (!e) return;
   var d = toString(new Date);
   var isProxy = false;
   if (e && e.isProxy){
      isProxy = true;
      e = e.getThis;
   }
   if (typeof e !== 'object'){
      e = d+' - '+e;
      console.log(e);
   }else{
      if (isProxy) {
         console.log(d+' - {')
         for (var i in e) {
            console.log('   '+i+': '+typeof e[i]);
         }
         console.log('}')
      } else {
         console.log(d+' ->');
         console.log(e);
      }
   }
};