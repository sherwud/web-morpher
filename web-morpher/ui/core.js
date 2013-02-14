$wm = (typeof $wm !== 'undefined' ? $wm : {});
$wm.core = {version:'0.0.0'};
$wm.core.loader = {};
$wm.core.loader.cached = {
   getHTML:true,
   
   jsonhtml:true,
   jsonmethod:false
};
$wm.core.loader.getHTML = function(url,cnt,fnc,efnc){
   if (typeof cnt === 'string') cnt = $(cnt);
   if (typeof cnt === 'function'){
      efnc = fnc; fnc = cnt; cnt = false;
   }
   $.ajax({
      type: 'GET',
      url: url,
      cache: $wm.core.loader.cached.getHTML,
      success: function(data){ 
         if (cnt!==false) cnt.html(data);
         if (typeof fnc === 'function') fnc(data);
      },
      error: function(data){
         if (cnt!==false) cnt.html(data['status']+' '+data['statusText']+': '+url);
         if (typeof efnc === 'function') efnc(data);
      }
   }); 
};
$wm.core.nav = {};
$wm.core.nav.hash = {
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
      var hash = $wm.core.nav.hash.get();
      hash[name]=val;
      window.location.hash = '#'+JSON.stringify(hash);
   },
   remove: function(name){
      var hash = $wm.core.nav.hash.get();
      (name!==undefined)?(delete hash[name]):(hash = {});
      window.location.hash = '#'+JSON.stringify(hash);
   }
};