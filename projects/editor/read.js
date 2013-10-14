//подключаем модуль работы с файловой системой
var fs = require('fs');

//----------------------------------------------------------------------------------------------------------------------
/*
 * функция возвращает объект,
 * свойства которого соответствуют содержимому каталога,
 * путь которого передаем в качестве аргумента
 */
function nodelist(path){
   //проверяем что по указанному пути у нас что то есть и что это дирректория
   if(fs.existsSync(path) && !fs.statSync(path).isFile()){
      var list = {};
      var templist = fs.readdirSync(path);
      for (var i in templist){
         //создаем объект, в который запишем свойства каждого файла/дирректории
         var obg = {name:templist[i], folder:false, path:'', node:path}
         //если в качестве пути передан корень - небудем ставить лишний слэш
         if(path === './') obg['path'] = path + obg['name'];
         else obg['path'] = path + '/' + obg['name'];
         //проверяем файл или папка, назначаем свойство
         if(fs.statSync(obg['path']).isFile()) obg['folder'] = false;
         else obg['folder'] = true;
         //запишем объект со свойствами папки/файла в общий объект, который и вернем
         list[templist[i]] = obg;
      }
      list = JSON.stringify(list);
      return list;
   }
   else if(fs.existsSync(path) && fs.statSync(path).isFile()) {
      var obg = {content:''}
      obg['content'] = fs.readFileSync(path, 'utf-8');
      obg = JSON.stringify(obg);
      return obg;
   }
}
exports.nodelist = nodelist;                      //так делаем, чтобы было можно использовать функцию во внешнем файле
//----------------------------------------------------------------------------------------------------------------------
/*
* функция проверяет существует ли файл и файл ли находится по указаному пути,
* и если все ок, то пишет в файл контент
* принимает путь к файлу
* возвращает сообщение об успешной записи в случае успеха, либо сообщение об ошибке
 */
function SaveFile(path, data){
   if(fs.existsSync(path) && fs.statSync(path).isFile()){
      fs.writeFileSync(path, data);
   }
   else {
      console.error('file not found');
   }
}
exports.SaveFile = SaveFile;
//----------------------------------------------------------------------------------------------------------------------