"use strict";
var path = wm.ext.path;
exports = module.exports = {};
exports.wmroot = path.dirname(path.normalize(module.parent.parent.filename));
exports.root = path.dirname(exports.wmroot);
exports.siteroot = path.dirname(path.normalize(module.parent.parent.parent.filename));