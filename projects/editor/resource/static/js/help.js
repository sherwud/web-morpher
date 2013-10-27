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
/**
 * Функция возвращает значение запрашиваемого параметра из куков
 * Возвращает содержимое запрашиваемого свойства,
 * если в свойстве ничего нет или такое свойство не найдено - default {string}
 * в остальных случаях ошибка
 * @param target {string}- что ищем
 * @param callback {function}- что нужно сделать с данными которые вернет функция
 */
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
/**
 * Функция удаляет указанный параметр из куков
 * Возвращает в случае успеха true, неудачи - false
 * в остальных - ошибку
 * @param target {string}- свойство которое грохаем
 * @param callback {function}- что нужно сделать после того как грохнем
 */
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
