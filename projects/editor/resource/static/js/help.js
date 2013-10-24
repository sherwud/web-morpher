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
}
//----------------------------------------------------------------------------------------------------------------------
