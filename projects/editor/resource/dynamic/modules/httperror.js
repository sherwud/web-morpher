/**
 * тута ббуду собирать популярные ошибки что б не повторять громадные латухи с обработкой ошибок
 */
//----------------------------------------------------------------------------------------------------------------------
/**
 * функция принимает путь к запрашиваемому файлу, и объект для ответа response
 * если он параметр не пустота то вернет корректный ответ о ненайденом  файле/директории
 * в противном случае ошибка 400
 */
function incorrectPath(path, res) {
   if (path && path != '') {
      console.error('file or directory on '+path+' doesnt exists');
      res.send(400, 'file or directory on '+path+' doesnt exists');
   }
   else {
      console.error('Bad Request');
      res.send(400, 'Bad Request');
   }
}
exports.incorrectPath = incorrectPath;
//----------------------------------------------------------------------------------------------------------------------
врвырварварвар