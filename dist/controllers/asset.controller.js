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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetController = void 0;
class AssetController {
    constructor(service) {
        this.service = service;
    }
    summary(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { accountId } = params;
            try {
                const { walletId } = device;
                const summary = yield this.service.summary(walletId, Number(accountId));
                return res.json(summary);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    getSupportedAssets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { accountId } = params;
            try {
                const { walletId } = device;
                const all = (yield this.service.findAll(walletId, Number(accountId), false, false)).reduce((acc, v) => {
                    acc[v.id] = v;
                    return acc;
                }, {});
                const assets = (yield this.service.getSupportedAssets()).filter((asset) => !(asset.id in all) &&
                    (asset.type === "BASE_ASSET" || asset.baseAsset in all));
                return res.json(assets);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { accountId } = params;
            try {
                const { walletId } = device;
                const assets = yield this.service.findAll(walletId, Number(accountId));
                return res.json(assets);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    findOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { accountId, assetId } = params;
            try {
                const { walletId } = device;
                const asset = yield this.service.findOne(walletId, Number(accountId), assetId);
                return res.json(asset);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    addAsset(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { accountId, assetId } = params;
            try {
                const { walletId } = device;
                const asset = yield this.service.addAsset(walletId, Number(accountId), assetId);
                return res.json(asset);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    getBalance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { accountId, assetId } = params;
            try {
                const { walletId } = device;
                const balance = yield this.service.getBalance(walletId, Number(accountId), assetId);
                return res.json(balance);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    getAddress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { accountId, assetId } = params;
            try {
                const { walletId } = device;
                const address = yield this.service.getAddress(walletId, Number(accountId), assetId);
                return res.json(address);
            }
            catch (err) {
                return next(err);
            }
        });
    }
}
exports.AssetController = AssetController;
