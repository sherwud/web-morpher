"use strict";
var path = require('path');
exports = module.exports = {};
exports.wmroot = path.dirname(path.normalize(module.parent.parent.filename));
exports.siteroot = path.dirname(path.normalize(module.parent.parent.parent.filename));