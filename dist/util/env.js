"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvOrThrow = void 0;
function getEnvOrThrow(name) {
    const v = process.env[name];
    if (v === undefined) {
        throw new Error(`Env Variable not found: '${name}'`);
    }
    return v;
}
exports.getEnvOrThrow = getEnvOrThrow;
