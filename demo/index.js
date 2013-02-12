$wm = (typeof $wm !== 'undefined' ? $wm : {});
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
      var hash = $wm.core.nav.hash.get();
      var page = hash['page'];
      var cnt = $('#wm-page > .wm-html-padding');
      cnt.html('<div class="wm-html-info">Загрузка...</div>');
      if (page !== undefined) { 
         $wm.loader.html(cnt,'html/'+page+'.html',$wm.syntaxHighlight);
         $wm.nav.setActiveLink(page);
      } else {
         $wm.loader.html(cnt,'html/index.html',$wm.syntaxHighlight);
         $wm.nav.setActiveLink('index');
      }
      
   },
   setActiveLink: function(page){
      $('li.active').removeClass('active');
      $('a.wm-nav-link.active').removeClass('active');
      $('a.no-radius').removeClass('no-radius');
      $('a.radius').removeClass('radius');
      var highlight = function(){
         var a = $('a.wm-nav-link[href*="\"'+page+'\""]');
         var li = a.parent();
         var radius = function(){
            $('a',$('#wm-menu nav[style*="block"]>ul>li:last-child').last()).addClass('radius');
         }; 
         if (li.get(0).tagName === 'LI') {
            li.addClass('active');
            $('#wm-menu nav').css('display','none');
            var i = li;
            while (i && i.get(0).id !== 'wm-menu') {
               if (i.get(0).tagName === 'NAV')
                  i.css('display','block');
               if (i.get(0).tagName === 'LI' && $('nav',i).length > 0)
                  $('a',i).addClass('no-radius');
               i = i.parent();
            }
            var nav = $('> nav',li);
            if (nav.length > 0){
               nav.css('display','block');
               if (nav.text()==='')
                  $wm.loader.html(nav,'html/'+$wm.path.dir(page)+'/menu.html',radius);
               else radius();
            } else radius();
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
                  $wm.loader.html(nav,'html/'+root+'/menu.html',function(){
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
   var cmd = [
      [/\n/g,'<br>'],
      [/ /g,'&nbsp;'],
      [/^<br>/g,''],
      [/(\/\w+)/,'<span class="comment">$1</span>'],
      [/(cd)([^\w])/g,'<span class="syntax">$1</span>$2'],
      [/(npm)([^\w])/g,'<span class="syntax">$1</span>$2'],
      [/(node)([^\w])/g,'<span class="syntax">$1</span>$2'],
      [/(--\w+):/g,'<span class="obj-elm">$1</span>:']
      
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
   $('.wm-code.cmd').each(function(i, elem) {
      for (var i in cmd) {
         elem.innerHTML = elem.innerHTML.replace(cmd[i][0],cmd[i][1]);
      }
   });
};
$(window).bind('load', function(){
   $wm.loader.html('#wm-menu-cnt','html/menu.html',function(){
      $wm.loader.html('#wm-news','html/news/menu.html',function(){
         $wm.nav.apply();
      });
   });
   
});
$(window).bind('hashchange', function(){
   $wm.nav.apply();
});