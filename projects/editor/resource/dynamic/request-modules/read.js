//подключаем модуль работы с файловой системой
var fs = wm.ext.fs;
var path = wm.ext.path;
var httperror = wm.modules.httperror;
exports.post = {};
//----------------------------------------------------------------------------------------------------------------------
/**
 * функция возвращает объект,
 * свойства которого соответствуют содержимому каталога,
 * путь которого передаем в качестве аргумента
 */
function nodelist(req, res){
   var path = req.body['path'];
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
      res.end(list);
   }
   else if(fs.existsSync(path) && fs.statSync(path).isFile()) {
      var obg = {content:''}
      obg['content'] = fs.readFileSync(path, 'utf-8');
      obg = JSON.stringify(obg);
      res.end(obg);
   }
   else {
      httperror.incorrectPath(req.body['path'], res);
   }
}
exports.post.nodelist = nodelist;   //так делаем, чтобы было можно использовать функцию во внешнем файле
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция для получения списка проектов и пути к ним
 * принимает пока что test параметр "startList"
 * возвращает JSON
 */
function selectProject(req, res) {
   var rootPath = wm.server.config.additional.rootPath;
   if(req.body['type'] && req.body['type']==='startList') {
      var list = {}
      for(var key in wm.server.config.additional.projects) {
         list[key] = wm.server.config.additional.projects[key];
      }
      //склеим пути к проектам с относительным путем корневой дирректории
      for (var j in list) {
         var prpath = list[j];
         list[j] = rootPath + prpath;
      }
      list = JSON.stringify(list);
      res.send(list);
   }
   res.end('ne popal');
}
exports.post.selectProject = selectProject;
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция для переименовывания файла/дирректории
 * name - новое имя файла
 * node - путь к каталогу в котором находится файл
 * curname - текущее имя файла
 */
function rename (req, res) {
   if(req.body['name'] && req.body['node'] && req.body['curname']) {
      var filename = req.body['node'] + '/' + req.body['name'];
      var curname = req.body['node'] + '/' + req.body['curname'];
      fs.rename(curname, filename, function(err) {
         if(err) { res.send(500, err); }
         else { res.send(200, 'File has been recorded'); }
      });
   }
   else { res.send(400, 'Bad Request'); }
}
exports.post.rename = rename;
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция для создания файла
 * принимает имя Создаваемого файла, путь к дирректории в которой необходимо его создать
 */
function createFile (req, res) {
   if(req.body['name'] && req.body['node']) {
      var filename = req.body['node'] + '/' + req.body['name'];
      var data = req.body['data'] ? req.body['data'] : '';
      fs.appendFile(filename, data, function(err){
         if(err) { res.send(500, err); }
         else { res.send(200, 'File has been created'); }
      });
   }
   else { res.send(400, 'Bad Request'); }
}
exports.post.createFile = createFile;
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция для внесения изменения (сохранения) в файл
 * name - имя файла
 * node - путь к каталогу в котором находится файл
 * data - конечное содержимое файла
 */
function editFile (req, res) {
   if(req.body['name'] && req.body['node'] && req.body['data']) {
      var filename = req.body['node'] + '/' + req.body['name'];
      var data = req.body['data'];
      fs.writeFile (filename, data, function(err) {
         if(err) { res.end(500, err); }
         else { res.send(200, 'File has been recorded'); }
      });
   }
   else { res.send(400, 'Bad Request'); }
}
exports.post.editFile = editFile;
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция для удаления файла
 * name - имя файла
 * node - путь к каталогу в котором находится файл
 */
function deleteFile (req, res) {
   if (req.body['name'] && req.body['node']) {
      var path = req.body['node'] + '/' + req.body['name'];
      fs.unlink(path, function(err) {
         if (err) { res.send(500, err); }
         else { res.send(200, 'File has been deleted'); }
      });
   }
   else { res.send(400, 'Bad Request'); }
}
exports.post.deleteFile = deleteFile;
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция для создания новой дирректории
 * name - имя файла
 * node - путь к каталогу в котором находится файл
 */
function createDirectory (req, res) {
   if(req.body['name'] && req.body['node']) {
      var path = req.body['node'] + '/' + req.body['name'];
      fs.mkdir(path, function(err) {
         if (err) { res.send(500, err); }
         else  { res.send(200, 'Directory has benn created'); }
      });
   }
   else { res.send(400, 'Bad request'); }
}
exports.post.createDirectory = createDirectory;
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция для удаления дирректории и всего ее содержимого
 * Помимо "нодовских" инструментов использует 2 дополнительные функции fsRemove и fsClear
 * Искать в ядре морфера, на текущий момент util.js
 * name - имя файла
 * node - путь к каталогу в котором находится файл
 */
function deleteDirectory (req, res) {
   debugger;
   if(req.body['name'] && req.body['node']) {
      var path = req.body['node'] + '/' + req.body['name'];
      wm.util.fsRemove(path, function(err) {
         if (err) { res.send(500, err); }
         else { res.send(200, 'Directory has benn deleted'); }
      });
   }
   else { res.send(400, 'Bad request'); }
}
exports.post.deleteDirectory = deleteDirectory;
//----------------------------------------------------------------------------------------------------------------------
