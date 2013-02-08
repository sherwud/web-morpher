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
$wm.path = {
   __check: function(path){
      if (path === undefined || path.search('/') === -1)
         return false;
      if (path[0]==='/')
         path = path.substr(1,path.length-1);
      if (path[path.length-1]==='/')
         path = path.substr(0,path.length-1);
      return path;
   },
   dir: function(path){
      path = $wm.path.__check(path);
      if (path === false) return '';
      var p = path.split('/');
      p.length -= 1;
      return p.join('/');
   },
   cutRoot: function(path){
      path = $wm.path.__check(path);
      if (path === false) return ['',''];
      var p = path.split('/');
      return [p.shift(),p.join('/')];
   }
};
$wm.loader = {
   html: function(container,url,func){
      $.ajax({
         type: 'GET',
         url: url,
         cache: $wm.globalCached,
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
   }
};
$wm.nav = {
   apply: function(){
      var hash = $wm.hash.get();
      var page = hash['page'];
      var cnt = $('#wm-page > .wm-html-padding');
      cnt.html('<div class="wm-html-info">Загрузка...</div>');
      if (page !== undefined) { 
         $wm.loader.html(cnt,'/html/'+page+'.html',$wm.syntaxHighlight);
         $wm.nav.setActiveLink(page);
      } else {
         $wm.loader.html(cnt,'/html/index.html',$wm.syntaxHighlight);
         $wm.nav.setActiveLink('index');
      }
      
   },
   setActiveLink: function(page){
      $('li.active').removeClass('active');
      $('a.wm-nav-link.active').removeClass('active');
      var highlight = function(){
         var a = $('a.wm-nav-link[href*="\"'+page+'\""]');
         var li = a.parent();
         if (li.get(0).tagName === 'LI') {
            li.addClass('active');
            $('#wm-menu nav').css('display','none');
            var i = li;
            while (i && i.get(0).id !== 'wm-menu') {
               if (i.get(0).tagName === 'NAV')
                  i.css('display','block');
               i = i.parent();            
            }
            var nav = $('> nav',li);
            if (nav.length > 0){
               nav.css('display','block');
               if (nav.text()==='')
                  $wm.loader.html(nav,'/html/'+$wm.path.dir(page)+'/menu.html');
            }
         } else {
            a.addClass('active');
         }
         $('#wm-pageName').text(a.text());
         $('title').text('Web Morpher - '+a.text());
      };
      var buildMenu = function(root,page,func){
         var p = $wm.path.cutRoot(page);
         root = (root?(root+'/'):root)+p[0];
         if (p[0]!=='') {
            var li = $('a.wm-nav-link[href*="\"'+root+'/index\""]').parent();
            var nav = $('> nav',li);
            if (nav.length > 0){
               nav.css('display','block');
               if (nav.text()==='')
                  $wm.loader.html(nav,'/html/'+root+'/menu.html',function(){
                     buildMenu(root,p[1],func);
                  });
               else func();
            } else func();
         } else {
            if (typeof func === 'function') func();
         } 
      };
      var a = $('a.wm-nav-link[href*="\"'+page+'\""]');
      if (a.length > 0)
         highlight();
      else
         buildMenu('',page,highlight);
   }
};
$wm.syntaxHighlight = function(){
   var js = [
      [/\n/g,'<br>'],
      [/^<br>/g,''],
      [/ /g,'&nbsp;'],
      [/"([\s\S][^"]*)"/g,'<span class="comment">"$1"</span>'],
      [/'([\s\S][^']*)'/g,'<span class="comment">\'$1\'</span>'],
      [/(var)\s+(\w+)/g,'<span class="syntax">$1</span> <span class="var-key">$2</span>'],
      [/(\w+)\s*\(/g,'<span class="func">$1</span>('],
      [/(\w+)\s*\:/g,'<span class="obj-elm">$1</span>:'],
      [/([0-9]+)(\.*)([0-9]+)/g,'<span class="num">$1$2$3</span>'],
      [/\/\*([\s\S]*)\*\//g,'<span class="comment">\/\*$1\*\/</span>'],
      [/\*\//g,'\*\/<br>']
   ];
   var json = [
      [/\n/g,'<br>'],
      [/^<br>/g,''],
      [/ /g,'&nbsp;'],
      [/"([\s\S][^"]*)":/g,'"<span class="obj-elm">$1</span>":']
   ];
   var http = [
      [/"([\s\S][^"]*)":/g,'"<span class="obj-elm">$1</span>":'],
      [/(http:\/\/\w+)/g,'<span class="comment">$1</span>'],
      [/(#)/g,'<b>$1</b>']
   ];
   $('.wm-code.js').each(function(i, elem) {
      for (var i in js) {
         elem.innerHTML = elem.innerHTML.replace(js[i][0],js[i][1]);
      }
   });
   $('.wm-code.json').each(function(i, elem) {
      for (var i in json) {
         elem.innerHTML = elem.innerHTML.replace(json[i][0],json[i][1]);
      }
   });
   $('.wm-code.http').each(function(i, elem) {
      for (var i in http) {
         elem.innerHTML = elem.innerHTML.replace(http[i][0],http[i][1]);
      }
   });
};
$(window).bind('load', function(){
   $wm.loader.html('#wm-aside-left','/html/menu.html',function(){
      $wm.loader.html('#wm-news','/html/news/menu.html',function(){
         $wm.nav.apply();
      });
   });
   
});
$(window).bind('hashchange', function(){
   $wm.nav.apply();
});