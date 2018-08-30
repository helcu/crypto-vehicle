"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
    var elem = document.createElement("canvas");
    return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
});
//# sourceMappingURL=isSupportWebP.js.map