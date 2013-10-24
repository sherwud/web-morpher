/**
 * Здесь собираем функции для работы с cookie, session, авторизацией
 * crreated: sherwud
 */
var fs = require('fs');
//var httperror = require('httperror');
exports.post = {};
//----------------------------------------------------------------------------------------------------------------------
/**
* Функция для получения последнего выбранного проекта
* Если пользователь авторизован и в куке хранится путь к проекту, она вернет путь,
* Если авторизован и в  куке нет пути, она вернет 'default'
* Если не авторизован 401 - Unauthorized
 */
function getDefaultProject(req, res) {
   if (req.session && req.session.uuid) {
      if (req.session.projectPath && req.session.projectName) {
         var lastProject = {
            'path':req.session.projectPath,
            'name':req.session.projectName
         }
         lastProject = JSON.stringify(lastProject);
         res.end(lastProject);
      }
      else {
         res.end('default');
      }
   }
   else {
      res.send(401, 'Unauthorized');
   }
}
exports.post.getDefaultProject = getDefaultProject;
//----------------------------------------------------------------------------------------------------------------------
/**
* Функция для записи свойства куки - defaultProject
* Принимает путь к проекту
* В случае успеха возвращает true
* В случае неудачи false
* В остальных случаях ошибку
 */
function setDefaultProject(req, res){
   if (req.body['path'] && req.body['name']) {
      var rootPath = wm.server.config.additional.rootPath;
      var availablePr = wm.server.config.additional.projects;
      var marker = false;
      for(var key in wm.server.config.additional.projects) {
         if (req.body['path'] == rootPath+availablePr[key] && req.body['name'] == key) {
            req.session.projectPath = req.body['path'];
            req.session.projectName = req.body['name'];
            req.session.projectTabs = {};
            marker = true;
         }
      }
      res.send(marker);
   }
   else {
      httperror.incorrectPath(req.body['path'], res);
   }
}
exports.post.setDefaultProject = setDefaultProject;
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция для получения набора вкладок, которые были открыты при последней сессии
 * Если пользователь авторизован и в куке хранится информация о вкладках, она вернет JSON со списком
 * последних открытых вкладок и пути к открытым в них файлах
 * Если авторизован и в  куке нет пути, она вернет 'default'
 * Если не авторизован 401 - Unauthorized
 */
function getDefaultTabs(req, res) {
   if (req.session && req.session.uuid) {
      if (req.session.projectTabs) {
         //спааааааааааааать
      }
      else {
         res.end('default');
      }
   }
   else {
      res.send(401, 'Unauthorized');
   }
}
exports.post.getDefaultTabs = getDefaultTabs;
//----------------------------------------------------------------------------------------------------------------------
/**
 * Функция устанавливает в куку объект, который содержит в себе
 * информацию о последних открытых вкладках
 * Принимает путь к вкладке, и имя открытого файла
 * Возвращает true в случае успеха
 * В случае неудачи false
 * В остальных случаях ошибку
 */
function setDefaultTabs(req, res) {
   if (req.body['path'] && req.body['name']) {
      var path = req.body['path'];
      var name = req.body['name'];
      if(fs.existsSync(path) && fs.statSync(path).isFile()) {
         req.session.projectTabs[name] = path;
         res.send(true);
      }
      res.send(false);
   }
   else {
      httperror.incorrectPath(req.body['path'], res);
   }
}
exports.post.setDefaultTabs = setDefaultTabs;
//----------------------------------------------------------------------------------------------------------------------