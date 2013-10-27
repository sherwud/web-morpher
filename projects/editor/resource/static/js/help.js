/**
 * Тута будем хранить различные вспомогательные функции
 * создал: sherwud
 */
//----------------------------------------------------------------------------------------------------------------------
/**
 * функция  устанвливает значения куки
 * path :: string -> путь к проекту (в случае изменения проекта)
 * path :: object -> должен содержать в каждом свойстве путь к табу (в случае открытия нового таба)
 * callback :: function()
 */
function setCookie(path, callback) {
   if (typeof(path) === 'string') {
      $.ajax({
         type: 'POST',
         url: '/call/session/setDefaultProject',
         data: "path="+path+"&name="+$('#projectSelect').val(),
         success: callback
      });
   }
   else if (typeof(path) === 'object') {
      $.ajax({
         type: 'POST',
         url: '/call/session/setDefaultTabs',
         data:"path="+path['path']+"&name="+path['name'],
         success: callback
      });
   }
   else {
      console.error('method: setCookie, path is not defined');
   }
}
//----------------------------------------------------------------------------------------------------------------------
function getCookie(target, callback) {
   if (target === 'project') {
      $.ajax({
         type: 'POST',
         url: '/call/session/getDefaultProject',
         success: callback
      });
   }
   else if (target === 'tabs') {
      $.ajax({
         type: 'POST',
         url: '/call/session/getDefaultTabs',
         success: callback
      });
   }
   else {
      console.error('method: getCookie, target is not defined');
   }
}
//----------------------------------------------------------------------------------------------------------------------
function delCookie(target, callback) {
   if (typeof(target) === 'object') {
      $.ajax({
         type: 'POST',
         url: '/call/session/delDefaultTabs',
         data:"path="+target['path']+"&name="+target['name'],
         success: callback
      });
   }
   else {
      console.error('method: setCookie, path is not defined');
   }
}
//----------------------------------------------------------------------------------------------------------------------
