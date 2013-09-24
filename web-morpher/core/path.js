"use strict";
var path = wm.ext.path;
exports = module.exports = {};
exports.wm = path.dirname(path.normalize(module.parent.parent.filename));
exports.root = path.dirname(exports.wm);
exports.startupdir = path.dirname(path.normalize(module.parent.parent.parent.filename));