"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addEventListener(elm, event, func) {
    if (func === void 0) { func = function () { }; }
    if ("addEventListener" in elm) {
        elm.addEventListener(event, func, false);
    }
    else if ("attachEvent" in elm) {
        elm.attachEvent("on" + event, func);
    }
}
exports.default = addEventListener;
//# sourceMappingURL=addEventListener.js.map