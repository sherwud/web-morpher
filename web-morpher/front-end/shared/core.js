window.$wm = new function() {
   this.ajax = ajax;

   function ajax(options, callback) {
      var http = new XMLHttpRequest();
      http.open(options.method, options.url, true);
      if ('function' === typeof callback) {
         http.onreadystatechange = function() {
            if (http.readyState == 4) {
               if (http.status == 200) {
                  callback(http.responseText);
               }
            }
         };
      }
      http.send(options.data || null);
   }
};