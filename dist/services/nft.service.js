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
exports.NFTService = void 0;
const fireblocks_sdk_1 = require("fireblocks-sdk");
const fetch_all_1 = require("../util/fetch-all");
class NFTService {
    constructor(clients) {
        this.clients = clients;
    }
    getNFT(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.clients.admin.getNFT(tokenId);
        });
    }
    getOwnedNFTs(ncwId, ncwAccountIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, fetch_all_1.fetchAll)((page) => this.clients.admin.getOwnedNFTs(Object.assign({ ncwAccountIds,
                ncwId, walletType: fireblocks_sdk_1.NFTOwnershipWalletType.END_USER_WALLET }, page)));
        });
    }
    listOwnedCollections(ncwId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, fetch_all_1.fetchAll)((page) => this.clients.admin.listOwnedCollections(Object.assign({ ncwId, walletType: fireblocks_sdk_1.NFTOwnershipWalletType.END_USER_WALLET }, page)));
        });
    }
    listOwnedAssets(ncwId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, fetch_all_1.fetchAll)((page) => this.clients.admin.listOwnedAssets(Object.assign({ ncwId, walletType: fireblocks_sdk_1.NFTOwnershipWalletType.END_USER_WALLET }, page)));
        });
    }
}
exports.NFTService = NFTService;
