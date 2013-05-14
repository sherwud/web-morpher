$wm.syntaxHighlight = function(elm){
   function space(s,s1,s2){
      var a = '';
      for (var i = 0; i < s2.length;i++) a += '&nbsp;';
      return s1+a;
   }
   function comment(s,s1){
      return '/*'+s1.replace(/([^/])(\*+)([^/])/g,function(s,s1,s2,s3){
         return s1+s2.replace(/\*/g,'#')+s3;
      })+'*/';      
   }
   var syntax = new RegExp('('
      +'if |else |function|typeof |return|window|false|true|this|while |for '
      +'| in |new '
      +')','g');
   var js = [
      [/\\'/g,'\\&prime;'],
      [/\\"/g,'\\&Prime;'],
      [/"([^"]*)"/g,'<span class="comment">"$1"</span>'],
      [/'([^']*)'/g,'<span class="comment">\'$1\'</span>'],
      [/(var)\W+(\w+)\W*\=/g,
         '<span class="syntax">$1</span> <span class="var-key">$2 =</span>'],
      [/(\w+)\W*\=\W*(function)/g,'<span class="func">$1</span> = $2'],
      [syntax,'<span class="syntax">$1</span>'],
      [/(\w+)\s*\(/g,'<span class="func">$1</span>('],
      [/(\$?[a-zA-z]+\w*)\s*\./g,'<span class="obj">$1</span>.'],
      [/(\w+)\s*\:/g,'<span class="obj-elm">$1</span>:'],
      [/\.\s*([a-zA-z]+\w*)/g,'.<span class="obj-elm">$1</span>'],
      [/([0-9]+)(\.*)([0-9]+)/g,'<span class="num">$1$2$3</span>'],
      [/(\n)(\s+)/g,space],
      [/\n/g,'<br>'],
      [/^<br>/g,''],
      [/\/\*([\s\S]*)\*\//g,comment],
      [/\/\*([^*]*)\*\//g,'<span class="comment">\/\*$1\*\/</span>']
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
   $('.wm-code.js',elm).each(function(i, elem) {
      var html = elem.innerHTML;
      for (var i in js) {
         html = html.replace(js[i][0],js[i][1]);
      }
      elem.innerHTML = html;
   });
   $('.wm-code.json',elm).each(function(i, elem) {
      var html = elem.innerHTML;
      for (var i in json) {
         html = html.replace(json[i][0],json[i][1]);
      }
      elem.innerHTML = html;
   });
   $('.wm-code.http',elm).each(function(i, elem) {
      var html = elem.innerHTML;
      for (var i in http) {
         html = html.replace(http[i][0],http[i][1]);
      }
      elem.innerHTML = html;
   });
   $('.wm-code.cmd',elm).each(function(i, elem) {
      var html = elem.innerHTML;
      for (var i in cmd) {
         html = html.replace(cmd[i][0],cmd[i][1]);
      }
      elem.innerHTML = html;
   });
};