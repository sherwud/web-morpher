/**
 * Здесь собираем функции для работы с cookie, session, авторизацией
 * crreated: sherwud
 */
exports.post = {};
//----------------------------------------------------------------------------------------------------------------------
/*
* Функция для получения последнего выбранного проекта
* Если пользователь авторизован и в куке хранится путь к проекту, она вернет путь,
* Если авторизован и в  куке нет пути, она вернет 'default'
* Если не авторизован 401 - Unauthorized
 */
function defaultProject(req, res) {
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
exports.post.defaultProject = defaultProject;
//----------------------------------------------------------------------------------------------------------------------
/*
* Функция для записи свойства куки - defaultProject
* Принимает путь к проекту
* В случае успеха возвращает true
* В случае неудачи (проект не найден в конфиге) false
* В случае бреда в запросе: 400 - 'Bad Request'
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
            marker = true;
         }
      }
      res.send(marker);
   }
   else {
      res.send(400, 'Bad Request');
   }
}
exports.post.setDefaultProject = setDefaultProject;
//----------------------------------------------------------------------------------------------------------------------