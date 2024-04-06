"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const errorHandler = (error, req, res, next) => {
    var _a, _b, _c, _d, _e;
    console.error("error handling request", error);
    if (res.headersSent) {
        return next(error);
    }
    if (axios_1.default.isAxiosError(error)) {
        res.status((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 500).json({ error: error.message });
    }
    else {
        res
            .status((_d = (_c = error.statusCode) !== null && _c !== void 0 ? _c : error.status) !== null && _d !== void 0 ? _d : 500)
            .json({ error: (_e = error.message) !== null && _e !== void 0 ? _e : "Internal server error" });
    }
};
exports.errorHandler = errorHandler;
