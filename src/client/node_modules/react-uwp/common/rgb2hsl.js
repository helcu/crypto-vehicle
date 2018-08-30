"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(r, g, b, resultIsArray) {
    if (r === void 0) { r = 255; }
    if (g === void 0) { g = 255; }
    if (b === void 0) { b = 255; }
    if (resultIsArray === void 0) { resultIsArray = false; }
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = (max + min) / 2;
    var s = h;
    var l = h;
    if (max === min) {
        h = s = 0;
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return resultIsArray ? [
        (h * 100 + 0.5) | 0,
        (s * 100 + 0.5) | 0,
        (l * 100 + 0.5) | 0
    ] : "hsl(" + [
        (h * 100 + 0.5) | 0,
        ((s * 100 + 0.5) | 0) + "%",
        ((l * 100 + 0.5) | 0) + "%"
    ].join(", ") + ")";
}
exports.default = default_1;
//# sourceMappingURL=rgb2hsl.js.map