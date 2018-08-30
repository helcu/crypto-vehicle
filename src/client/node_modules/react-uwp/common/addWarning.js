"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addWarning(warning) {
    return function (target, propertyKey, descriptor) {
        var originFunc = descriptor.value;
        descriptor.value = function () {
            console.warn("Calling \"" + name + "\" with " + arguments);
            return originFunc.apply(target, arguments);
        };
        return descriptor;
    };
}
exports.default = addWarning;
//# sourceMappingURL=addWarning.js.map