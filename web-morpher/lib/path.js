"use strict";
var path = require('path');
wm.path = {};
wm.path.wmroot = path.dirname(path.normalize(module.filename));
wm.path.siteroot = path.dirname(path.normalize(module.parent.filename));