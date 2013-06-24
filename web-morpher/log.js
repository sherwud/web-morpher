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
   var d = toString(new Date);
   if (e && e.isProxy) e = e.getThis();
   if (typeof e === 'string')
      e = d+' - '+e;
   else
      console.log(d)
   console.log(e);
};