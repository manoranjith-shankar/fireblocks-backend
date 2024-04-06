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
exports.getMetadataForAssets = exports.getMetadataForAsset = void 0;
const lru_cache_1 = require("lru-cache");
const ms_1 = __importDefault(require("ms"));
const symbolMockTestTransform_1 = require("./symbolMockTestTransform");
const banlist_1 = require("./banlist");
// note: example only, you might want to configure according to:
// https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions
const cache = new lru_cache_1.LRUCache({
    max: 50000,
    ttl: (0, ms_1.default)("1 month"),
});
function getMetadataForAsset(asset, cmc) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getMetadataForAssets([asset], cmc))[asset];
    });
}
exports.getMetadataForAsset = getMetadataForAsset;
function getMetadataForAssets(assets, cmc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const symbols = [
                ...new Set(assets.map(symbolMockTestTransform_1.symbolMockTestTransform)).values(),
            ].filter((a) => !banlist_1.banlist.has(a));
            if (symbols.length === 0) {
                return {};
            }
            const missingSymbols = symbols.filter((s) => !cache.has(s));
            if (missingSymbols.length) {
                const params = {
                    symbol: missingSymbols.join(","),
                    aux: "logo",
                    skipInvalid: true,
                };
                const meta = yield cmc.info(params);
                if (!(meta === null || meta === void 0 ? void 0 : meta.data)) {
                    throw Error(`failed to fetch metadata`);
                }
                for (const symbol of missingSymbols) {
                    if (!meta.data[symbol]) {
                        banlist_1.banlist.set(symbol, new Date());
                        continue;
                    }
                    cache.set(symbol, meta.data[symbol]);
                }
            }
            return Object.fromEntries(assets.map((a) => [a, cache.get((0, symbolMockTestTransform_1.symbolMockTestTransform)(a))]));
        }
        catch (e) {
            console.warn(`failed getting metadata for assets ${assets}`, e);
            return {};
        }
    });
}
exports.getMetadataForAssets = getMetadataForAssets;
