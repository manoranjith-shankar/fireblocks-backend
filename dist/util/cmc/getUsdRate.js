"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsdRateForAssets = exports.getUsdRateForAsset = void 0;
const lru_cache_1 = require("lru-cache");
const ms_1 = __importDefault(require("ms"));
const symbolMockTestTransform_1 = require("./symbolMockTestTransform");
const banlist_1 = require("./banlist");
// note: example only, you might want to configure according to:
// https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions
const cache = new lru_cache_1.LRUCache({
    max: 10000,
    ttl: (0, ms_1.default)("1 min"),
});
function getUsdRateForAsset(asset, cmc) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getUsdRateForAssets([asset], cmc))[asset];
    });
}
exports.getUsdRateForAsset = getUsdRateForAsset;
function getUsdRateForAssets(asset, cmc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const symbols = [
                ...new Set(asset.map(symbolMockTestTransform_1.symbolMockTestTransform)).values(),
            ].filter((a) => !banlist_1.banlist.has(a));
            if (symbols.length === 0) {
                return {};
            }
            const missingSymbols = symbols.filter((s) => !cache.has(s));
            if (missingSymbols.length) {
                const quotes = yield cmc.latestQuotes({
                    symbol: missingSymbols.join(","),
                    convert: "usd",
                    skipInvalid: true,
                });
                if (!(quotes === null || quotes === void 0 ? void 0 : quotes.data)) {
                    throw Error(`failed to fetch quotes`);
                }
                for (const symbol of missingSymbols) {
                    if (!quotes.data[symbol]) {
                        banlist_1.banlist.set(symbol, new Date());
                        continue;
                    }
                    cache.set(symbol, quotes.data[symbol].quote["USD"]);
                }
            }
            return Object.fromEntries(asset.map((a) => { var _a; return [a, (_a = cache.get((0, symbolMockTestTransform_1.symbolMockTestTransform)(a))) === null || _a === void 0 ? void 0 : _a.price]; }));
        }
        catch (e) {
            console.warn(`failed getting rate for asset ${asset}`, e);
            return {};
        }
    });
}
exports.getUsdRateForAssets = getUsdRateForAssets;
