"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IS_ELECTRON_ENV_1 = require("../electron/IS_ELECTRON_ENV");
var IS_NODE_ENV = global && global.process && !IS_ELECTRON_ENV_1.default;
exports.default = IS_NODE_ENV;
//# sourceMappingURL=IS_NODE_ENV.js.map