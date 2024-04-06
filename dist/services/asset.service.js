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
exports.AssetService = void 0;
const ms_1 = __importDefault(require("ms"));
const getUsdRate_1 = require("../util/cmc/getUsdRate");
const lru_cache_1 = require("lru-cache");
const fetch_all_1 = require("../util/fetch-all");
const getMetadata_1 = require("../util/cmc/getMetadata");
class AssetService {
    constructor(clients) {
        this.clients = clients;
        this.supportedAssets = undefined;
        this.feeCache = new lru_cache_1.LRUCache({
            max: 1000,
            ttl: (0, ms_1.default)("1m"),
            fetchMethod: (assetId) => __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield this.clients.admin.getFeeForAsset(assetId);
                }
                catch (e) {
                    console.warn(`failed getting fee for ${assetId}`, e);
                }
            }),
        });
    }
    getSupportedAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.supportedAssets) {
                const assets = yield (0, fetch_all_1.fetchAll)((page) => __awaiter(this, void 0, void 0, function* () {
                    const results = yield this.clients.admin.NCW.getSupportedAssets(page);
                    const [rates, metadata] = yield Promise.all([
                        (0, getUsdRate_1.getUsdRateForAssets)(results.data.map((a) => a.symbol), this.clients.cmc),
                        (0, getMetadata_1.getMetadataForAssets)(results.data.map((a) => a.symbol), this.clients.cmc),
                    ]);
                    return Object.assign(Object.assign({}, results), { data: results.data.map((asset) => {
                            var _a;
                            return (Object.assign(Object.assign({}, asset), { rate: rates[asset.symbol], iconUrl: (_a = metadata[asset.symbol]) === null || _a === void 0 ? void 0 : _a.logo }));
                        }) });
                }), 50);
                this.supportedAssets = assets;
            }
            return this.supportedAssets;
        });
    }
    findAll(walletId, accountId, fee = true, rate = true, meta = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const assets = yield (0, fetch_all_1.fetchAll)((page) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.clients.admin.NCW.getWalletAssets(walletId, accountId, page);
                const [rates, metadata] = yield Promise.all([
                    rate
                        ? yield (0, getUsdRate_1.getUsdRateForAssets)(response.data.map((a) => a.symbol), this.clients.cmc)
                        : Promise.resolve({}),
                    meta
                        ? yield (0, getMetadata_1.getMetadataForAssets)(response.data.map((a) => a.symbol), this.clients.cmc)
                        : Promise.resolve({}),
                ]);
                return Object.assign(Object.assign({}, response), { data: response.data.map((asset) => {
                        var _a;
                        return (Object.assign(Object.assign({}, asset), { rate: rates[asset.symbol], iconUrl: (_a = metadata[asset.symbol]) === null || _a === void 0 ? void 0 : _a.logo }));
                    }) });
            }), 50);
            return yield Promise.all(assets.map((asset) => __awaiter(this, void 0, void 0, function* () {
                return (Object.assign(Object.assign({}, asset), { fee: asset.hasFee && fee ? yield this.feeCache.fetch(asset.id) : undefined }));
            })));
        });
    }
    findOne(walletId, accountId, assetId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const asset = yield this.clients.admin.NCW.getWalletAsset(walletId, Number(accountId), assetId);
            const fee = asset.hasFee ? yield this.feeCache.fetch(asset.id) : undefined;
            const rate = yield (0, getUsdRate_1.getUsdRateForAsset)(asset.symbol, this.clients.cmc);
            const iconUrl = (_a = (yield (0, getMetadata_1.getMetadataForAsset)(asset.symbol, this.clients.cmc))) === null || _a === void 0 ? void 0 : _a.logo;
            return Object.assign(Object.assign({}, asset), { fee, rate, iconUrl });
        });
    }
    summary(walletId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const assets = yield this.findAll(walletId, Number(accountId));
            const result = yield Promise.all(assets.map((asset) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    asset,
                    address: yield this.getAddress(walletId, Number(accountId), asset.id),
                    balance: yield this.getBalance(walletId, Number(accountId), asset.id),
                });
            })));
            return result.reduce((acc, e) => {
                acc[e.asset.id] = e;
                return acc;
            }, {});
        });
    }
    addAsset(walletId, accountId, assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.clients.signer.NCW.activateWalletAsset(walletId, Number(accountId), assetId);
            return address;
        });
    }
    getBalance(walletId, accountId, assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.clients.admin.NCW.getWalletAssetBalance(walletId, Number(accountId), assetId);
            return balance;
        });
    }
    getAddress(walletId, accountId, assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = yield this.clients.admin.NCW.getWalletAssetAddresses(walletId, Number(accountId), assetId);
            return addresses.data[0];
        });
    }
}
exports.AssetService = AssetService;
