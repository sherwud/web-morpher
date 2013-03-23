$wm.test = new function(){
   var i = 0;
   this.i = function(){
      return i+=1;
   };
   this.ii = function(){
      return i-=1;
   };
}();