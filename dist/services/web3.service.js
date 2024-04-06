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
exports.Web3Service = void 0;
const fireblocks_sdk_1 = require("fireblocks-sdk");
const fetch_all_1 = require("../util/fetch-all");
class Web3Service {
    constructor(signer) {
        this.signer = signer;
    }
    find(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connections = yield (0, fetch_all_1.fetchAll)((page) => this.signer.getWeb3Connections(Object.assign({ filter: { walletId } }, page)));
            return connections;
        });
    }
    create(walletId, accountId, uri, feeLevel = fireblocks_sdk_1.Web3ConnectionFeeLevel.MEDIUM) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.signer.createWeb3Connection(fireblocks_sdk_1.Web3ConnectionType.WALLET_CONNECT, { uri, ncwId: walletId, ncwAccountId: accountId, feeLevel });
            return connection;
        });
    }
    approve(walletId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signer.submitWeb3Connection(fireblocks_sdk_1.Web3ConnectionType.WALLET_CONNECT, sessionId, true);
        });
    }
    deny(walletId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signer.submitWeb3Connection(fireblocks_sdk_1.Web3ConnectionType.WALLET_CONNECT, sessionId, false);
        });
    }
    remove(walletId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signer.removeWeb3Connection(fireblocks_sdk_1.Web3ConnectionType.WALLET_CONNECT, sessionId);
        });
    }
}
exports.Web3Service = Web3Service;
