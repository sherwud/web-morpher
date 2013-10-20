/**
 * Тута будем хранить различные вспомогательные функции
 * создал: sherwud
 */
//----------------------------------------------------------------------------------------------------------------------
// возвращает cookie, если есть, если нет, то undefined
//todo над дописать функцию - дополнить регуляркой и поиском по name
function getCookie() {
   var matches = document.cookie;
   return matches ? decodeURIComponent(matches).split('=')[1] : undefined;
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция устанавливает куку, обязательные параметры вызова - name, value
 * @param name {string} - собственно имя нашей куки
 * @param value {string} - и соответственно ее значение
 * @param options {object}
 *    @param expires {date, int} - время жизни куки, Если дату не указать cookie удаляется при закрытии браузера
 *    @param path {string} - Путь, внутри которого будет доступ к cookie. path=/ -> то есть cookie доступно со всех страниц сайта.
 *    @param domain {string} - Домен, на котором доступно cookie. Если не указать, то текущий домен.
 *    @param secure {boolean} - Cookie можно передавать только по HTTPS.
 *    @returns {boolean} вернет true в случае успеха и false в случае неудачи
 */
function setCookie(name, value, options) {
   options = options || {};

   var expires = options.expires;

   if (typeof expires == "number" && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires*1000);
      expires = options.expires = d;
   }
   if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
   }

   value = encodeURIComponent(value);

   var updatedCookie = name + "=" + value;

   for(var propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
         updatedCookie += "=" + propValue;
      }
   }

   document.cookie = updatedCookie;
}
//----------------------------------------------------------------------------------------------------------------------
// удаляет cookie с именем name
function deleteCookie(name) {
   setCookie(name, "", { expires: -1 })
}
//----------------------------------------------------------------------------------------------------------------------