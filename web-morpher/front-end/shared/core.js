window.$wm = new function() {
   this.ajax = ajax;

   function ajax(options, callback) {
      if ('undefined' === typeof options) {
         options = {};
      }
      if ('string' === typeof options) {
         options = {url: options};
      }
      if ('object' === typeof callback) {
         options.method = 'POST';
         options.data = (JSON.stringify(callback));
      }
      var http = new XMLHttpRequest();
      http.open(options.method || 'GET', options.url || '/', true);
      if (options.method === 'POST') {
         http.setRequestHeader(
               'Content-Type',
               'application/json; charset=utf-8'
               );
      }
      if ('function' === typeof callback) {
         http.onreadystatechange = function() {
            if (http.readyState === 4) {
               if (http.status === 200) {
                  callback(http.responseText);
               }
            }
         };
      }
      if (options.data) {
         options.data = (JSON.stringify(options.data));
      }
      http.send(options.data || null);
   }
};