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
exports.NFTController = void 0;
class NFTController {
    constructor(service) {
        this.service = service;
    }
    getOwnedNFTs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { accountId } = params;
            try {
                const { walletId } = device;
                const nfts = yield this.service.getOwnedNFTs(walletId, [accountId]);
                return res.json(nfts);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    listOwnedCollections(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device } = req;
            try {
                const { walletId } = device;
                const collections = yield this.service.listOwnedCollections(walletId);
                return res.json(collections);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    listOwnedAssets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device } = req;
            try {
                const { walletId } = device;
                const assets = yield this.service.listOwnedAssets(walletId);
                return res.json(assets);
            }
            catch (err) {
                return next(err);
            }
        });
    }
}
exports.NFTController = NFTController;
