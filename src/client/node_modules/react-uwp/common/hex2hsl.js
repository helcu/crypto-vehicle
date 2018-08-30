"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hex2rgb_1 = require("./hex2rgb");
var rgb2hsl_1 = require("./rgb2hsl");
function default_1(hex, opacity, resultIsArray) {
    if (hex === void 0) { hex = "#000"; }
    if (resultIsArray === void 0) { resultIsArray = false; }
    var rgb = hex2rgb_1.default(hex, true);
    var resultArray = rgb2hsl_1.default(rgb[0], rgb[1], rgb[2], true);
    resultArray = resultArray.concat(opacity);
    return resultIsArray ? resultArray : (function () {
        resultArray[1] = resultArray[1] + "%";
        resultArray[2] = resultArray[2] + "%";
        return "hsla(" + resultArray.join(", ") + ")";
    })();
}
exports.default = default_1;
//# sourceMappingURL=hex2hsl.js.map