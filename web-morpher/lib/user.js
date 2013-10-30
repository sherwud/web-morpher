"use strict";
var path = wm.ext.path;
var util = wm.util;
var shared = path.join(wm.path.wmroot,'front-end','shared');
module.exports = userAuth;
module.exports.__isProxy = true;
var users = {};
var config = wm.server.config.users;
function userAuth(req, res, next) {
   var uuid = req.session.uuid;
   if (!(uuid in users)) {
      uuid = req.session.uuid = uuid || util.generateUUID();
      /*
       * Добавить проверку логина и пароля
       */
      if (config.guest) {
         users[uuid] = {name: 'Гость', role: 'guest'};
      } else {
         /*
          * Добавить переадресацию на форму авторизации
          */
         res.sendfile(path.join(shared,'login.html'))
         //res.send(401, '401 Unauthorized');
         return;
      }
   }
   req.user = users[uuid];
   req.user.lastLogin = new Date;
   next();
}