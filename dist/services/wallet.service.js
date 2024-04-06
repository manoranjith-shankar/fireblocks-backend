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
exports.WalletService = void 0;
const wallet_1 = require("../model/wallet");
const passphrase_1 = require("../model/passphrase");
class WalletService {
    constructor(clients) {
        this.clients = clients;
    }
    findOne(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wallet_1.Wallet.findOne({
                where: { id: walletId },
            });
        });
    }
    findAll(sub) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wallet_1.Wallet.find({
                where: { devices: { user: { sub } } },
            });
        });
    }
    getLatestBackup(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { passphraseId, createdAt, keys } = yield this.clients.signer.NCW.getLatestBackup(walletId);
            const passphrase = yield passphrase_1.Passphrase.findOneByOrFail({ id: passphraseId });
            return {
                passphraseId,
                location: passphrase.location,
                createdAt,
                deviceId: keys[0].deviceId,
            };
        });
    }
}
exports.WalletService = WalletService;
