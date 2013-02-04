$wm = {
   version:'0.0.0',
   versionName:'static pre-alpha',
   globalCached:false
};
$wm.hash = {
   get: function(){
      var hash = window.location.hash;
      try {
         return JSON.parse(hash.replace('#','')||'{}');
      } catch(e) {
         console.error('Ошибка разбора строки hash. "$wm.hash.get"');
         return {};
      }
   },
   set: function(name,val){
      var hash = $wm.hash.get();
      if (typeof hash !== 'object') hash = {};
      hash[name]=val;
      window.location.hash = '#'+JSON.stringify(hash);
   },
   remove: function(name){
      var hash = $wm.hash.get();
      if (typeof hash !== 'object') hash = {};
      (name!==undefined)?(delete hash[name]):(hash = {});
      window.location.hash = '#'+JSON.stringify(hash);
   }
};
$wm.loader = {
   html: function(container,url,func){
      $.ajax({
         type: 'GET',
         url: url,
         cache: $wm.globalCached,
         success: function(data){
            $(container).html(data);
            if (typeof func === 'function') func(data);
         },
         error: function(data){
            $(container).html($('<div class="wm-html-error">'+
               (data['status']||'404')+': '
               +(data['statusText']||'Not Found')+'<br>'+url
               +'</div>'));
         }
      }); 
   }
};
$wm.nav = {
   apply: function(){
      var hash = $wm.hash.get();
      var page = hash['page'];
      if (page !== undefined) { 
         $wm.loader.html('#wm-page > .wm-html-padding','/html/'+page+'.html');
         $wm.nav.setActiveLink(page);
      } else {
         $wm.loader.html('#wm-page > .wm-html-padding','/html/index.html');
         $wm.nav.setActiveLink('index');
      }
      
   },
   setActiveLink: function(name){
      $('li.active').removeClass('active');
      $('a.wm-nav-link.active').removeClass('active');
      var a = $('a.wm-nav-link[href*="'+name+'"]');
      var li = a.parent();
      if (li.get(0).tagName === 'LI') {
         li.addClass('active');
      } else {
         a.addClass('active');
      }
      $('#wm-pageName').text(a.text());
   }
};
$(window).bind('load', function(){
   $wm.loader.html('#wm-aside-left','/html/menu.html',function(){
      $wm.loader.html('#wm-news','/html/news.html',function(){
         $wm.nav.apply();
      });
   });
   
});
$(window).bind('hashchange', function(){
   $wm.nav.apply();
});