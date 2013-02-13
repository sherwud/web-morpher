$wm = (typeof $wm !== 'undefined' ? $wm : {});
$wm.core = {version:'0.0.0'};
$wm.core.loader = {};
$wm.core.loader.cached = {
   htmlcssjs:true,
   jsonhtml:true,
   jsonmethod:false
};
$wm.core.loader.html = function(container,url,func){
   $.ajax({
      type: 'GET',
      url: url,
      cache: $wm.core.loader.cached.htmlcssjs,
      success: function(data){
         if (typeof container === 'string')
            container = $(container);
         container.html(data);
         if (typeof func === 'function') func(data);
      },
      error: function(data){
         if (typeof container === 'string')
            container = $(container);
         container.html($('<div class="wm-html-info">'+
            (data['status']||'404')+': '
            +(data['statusText']||'Not Found')+'<br>'+url
            +'</div>'));
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