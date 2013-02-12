$wm = (typeof $wm !== 'undefined' ? $wm : {});
$wm.core = {};
$wm.core.hash = {
   get: function(name){
      var hash = window.location.hash;
      try {
         hash = JSON.parse(hash.replace('#','')||'{}');
         if (!hash instanceof Object || hash instanceof Array) hash = {};
         return (name!==undefined)?hash[name]:hash;
      } catch(e) {
         console.error('Ошибка разбора window.location.hash');
         return {};
      }
   },
   set: function(name,val){
      var hash = $wm.core.hash.get();
      hash[name]=val;
      window.location.hash = '#'+JSON.stringify(hash);
   },
   remove: function(name){
      var hash = $wm.core.hash.get();
      (name!==undefined)?(delete hash[name]):(hash = {});
      window.location.hash = '#'+JSON.stringify(hash);
   }
};