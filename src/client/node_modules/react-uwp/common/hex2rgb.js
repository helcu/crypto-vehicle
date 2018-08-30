"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(hex, resultIsArray) {
    if (hex === void 0) { hex = "#000"; }
    if (resultIsArray === void 0) { resultIsArray = false; }
    hex = hex.replace("#", "");
    var length = hex.length;
    if (length > 6) {
        hex = hex.slice(0, 6);
    }
    else if (length < 6) {
        if (6 % length === 0) {
            hex = hex.repeat(6 / length);
        }
        else {
            hex = hex + "0".repeat(6 - length);
        }
    }
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return resultIsArray ? [r, g, b] : "rgb(" + r + ", " + g + ", " + b + ")";
}
exports.default = default_1;
//# sourceMappingURL=hex2rgb.js.map