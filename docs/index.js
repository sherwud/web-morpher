$wm = {
   version:'0.0.0',
   versionName:'static pre-alpha',
   globalCached:false
};
$wm.loder = {
   html:function(container,url){
      jQuery.ajax({
         type: 'GET',
         url: url,
         cache: $wm.globalCached,
         success: function(data){
            $(container).html(data);
         }
      }); 
      /*$.get(url,function(data){
         $(container).html(data);
      })*/
   }
};
$(window).bind('load', function(){
   $wm.loder.html('#wm-aside-left','/html/menu.html')
});