"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function removeEventListener(elm, event, func) {
    if (func === void 0) { func = function () { }; }
    if (elm.removeEventListener) {
        elm.removeEventListener(event, func);
    }
    else if (elm.detachEvent) {
        elm.detachEvent("on" + event, func);
    }
}
exports.default = removeEventListener;
//# sourceMappingURL=removeEventListener.js.map