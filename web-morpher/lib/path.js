"use strict";
var path = require('path');
exports = module.exports = {};
exports.wmroot = path.dirname(path.normalize(module.filename));
exports.siteroot = path.dirname(path.normalize(module.parent.filename));