"use strict";
exports.__esModule = true;
exports.sanitize = void 0;
function sanitize(obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return value !== undefined;
    }));
}
exports.sanitize = sanitize;
