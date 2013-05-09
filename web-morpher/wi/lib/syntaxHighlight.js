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