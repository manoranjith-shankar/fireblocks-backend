"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.banlist = void 0;
const lru_cache_1 = require("lru-cache");
const ms_1 = __importDefault(require("ms"));
exports.banlist = new lru_cache_1.LRUCache({
    max: 10000,
    ttl: (0, ms_1.default)("1 day"),
});
