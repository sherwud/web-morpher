"use strict";
var path = wm.ext.path;
var util = wm.util;
var embedded = path.join(wm.path.wmroot, 'front-end', 'embedded');
module.exports = userAuth;
module.exports.__isProxy = true;
var users = {};
var config = wm.server.config.users;
function userAuth(req, res, next) {
   function auth() {
      function verify(isAuth) {
         if (isAuth === true) {
            return success(users[uuid]);
         }
         if (isAuth === false) {
            return res.send(403, '403 Forbidden');
         }
         if (config.guest) {
            return success(users[uuid] = {name: 'Гость', role: 'guest'});
         }
         return res.sendfile(path.join(embedded, 'login.html'));
      }
      return verify();
   }
   function success(user) {
      req.user = user;
      req.user.lastLogin = new Date;
      next();
   }
   var uuid = req.session.uuid;
   if (uuid in users) {
      return success(users[uuid]);
   }
   uuid = req.session.uuid = uuid || util.generateUUID();
   auth();
}