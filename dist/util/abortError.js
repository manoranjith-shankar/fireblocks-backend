"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAbortError = void 0;
function isAbortError(error) {
    return (typeof error === "object" &&
        error &&
        "name" in error &&
        (error === null || error === void 0 ? void 0 : error.name) === "AbortError");
}
exports.isAbortError = isAbortError;
