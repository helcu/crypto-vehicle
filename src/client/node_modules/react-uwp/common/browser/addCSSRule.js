"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addCSSRule(styleSheetStr, styleSheet) {
    if (styleSheet === void 0) { styleSheet = document.styleSheets[0]; }
    if (!styleSheet)
        styleSheet = document.styleSheets[0];
    var insertToRule = function (styleSheet) {
        if (styleSheet.hasOwnProperty("rules") && styleSheet.hasOwnProperty("insertRule")) {
            try {
                if (Array.isArray(styleSheetStr)) {
                    styleSheetStr.forEach(function (str) {
                        styleSheet.insertRule(str, 0);
                    });
                }
                else {
                    styleSheet.insertRule(styleSheetStr, 0);
                }
            }
            catch (e) {
                console.error(e);
                console.log(styleSheet, styleSheetStr);
            }
        }
    };
    if (!styleSheet) {
        var styleElm = document.createElement("style");
        document.head.appendChild(styleElm);
        insertToRule(styleElm.sheet);
    }
    else {
        insertToRule(styleSheet);
    }
}
exports.default = addCSSRule;
//# sourceMappingURL=addCSSRule.js.map