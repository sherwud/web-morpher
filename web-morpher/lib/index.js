"use strict";
var $wm = {};
global.wm = Proxy.create({
  get: function(){
     return function(){};
  },
  set: function(){
     return true;
  }
  /*getPropertyDescriptor: function(name) {
    //console.log(name);
    return wm['app'];
  },
  getOwnPropertyDescriptor: function(name) {
    //console.log(name);
    return wm['app'];
  }*/
});