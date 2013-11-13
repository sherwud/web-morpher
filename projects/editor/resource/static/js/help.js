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
/**
 * Функция создания файла по указаному пути, с указанным именем
 * @param name {string} имя нового файла (включая расширение)
 * @param node {string} путь к каталогу в котором необходимо создать файл
 * @param data {string} содержимое файла
 * @param callback {function} функция которую необходимо выполнить по завершению создания
 */
function createFile (name, node, data, callback) {
   if(name && node) {
      $.ajax({
         type: 'POST',
         url: '/call/read/createFile',
         data: 'name='+name+'&node='+node+'&data='+data,
         success: callback
      });
   }
   else {
      console.error('method: createFile, node or name is not defined');
   }
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция изменения (сохранения внесенных изменений) файла по указаному пути, с указанным именем
 * @param name {string} имя изменяемого файла (включая расширение)
 * @param node {string} путь к каталогу в котором изменяется файл
 * @param data {string} содержимое файла
 * @param callback {function} функция которую необходимо выполнить по завершению записи изменений
 */
function editFile (name, node, data, callback) {
   if(name && node && data) {
      $.ajax({
         type: 'POST',
         url: '/call/read/editFile',
         data: 'name='+name+'&node='+node+'&data='+data,
         success: callback
      });
   }
   else {
      console.error('method: createFile, node, name or data is not defined');
   }
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция удаления файла
 * @param name {string} имя удаляемого файла
 * @param node {string} путь к каталогу в котором удаляем файл
 * @param callback {function} функция которую необходимо выполнить по завершению удаления
 */
function deleteFile (name, node, callback) {
   if(name && node) {
      $.ajax({
         type: 'POST',
         url: '/call/read/deleteFile',
         data: 'name='+name+'&node='+node,
         success: callback
      });
   }
   else {
      console.error('method: createFile, node or name is not defined');
   }
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция создания дирректории
 * @param name {string} имя нового каталога
 * @param node {string} путь к каталогу в котором создаем дирректорию
 * @param callback {function} функция которую необходимо выполнить по завершению создания
 */
function createDirectory (name, node, callback) {
   if(name && node) {
      $.ajax({
         type: 'POST',
         url: '/call/read/createDirectory',
         data: 'name='+name+'&node='+node,
         success: callback
      });
   }
   else {
      console.error('method: createFile, node or name is not defined');
   }
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция удаления дирректории
 * @param name {string} имя удаляемого каталога
 * @param node {string} путь к каталогу в котором удаляем дирректорию
 * @param callback {function} функция которую необходимо выполнить по завершению удаления
 */
function deleteDirectory (name, node, callback) {
   if(name && node) {
      $.ajax({
         type: 'POST',
         url: '/call/read/deleteDirectory',
         data: 'name='+name+'&node='+node,
         success: callback
      });
   }
   else {
      console.error('method: createFile, node or name is not defined');
   }
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция переименовывания дирректории/файла
 * @param name {string} новое имя каталога/файла
 * @param node {string} путь к каталогу в котором находится файл/дирректория для переименовывания
 * @param curname {string} оригинальное (текущее) имя файла/дирректории
 * @param callback {function} функция которую необходимо выполнить по завершению создания
 */
function rename (name, node, curname, callback) {
   if(name && node && curname) {
      $.ajax({
         type: 'POST',
         url: '/call/read/rename',
         data: 'name='+name+'&node='+node+'&curname='+curname,
         success: callback
      });
   }
   else {
      console.error('method: createFile, node, name or curname is not defined');
   }
}
//----------------------------------------------------------------------------------------------------------------------