"use strict";
var path = wm.ext.path;
var __path = module.exports = {};
__path.wmroot = path.dirname(path.normalize(module.parent.parent.filename));
__path.root = path.dirname(__path.wmroot);
__path.startupdir = path.dirname(path.normalize(module.parent.parent.parent.filename));