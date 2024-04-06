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
exports.WalletController = void 0;
class WalletController {
    constructor(service) {
        this.service = service;
    }
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { auth } = req;
            const { sub } = auth.payload;
            try {
                const wallets = yield this.service.findAll(sub);
                res.json({
                    wallets: wallets.map(({ id }) => ({
                        walletId: id,
                    })),
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getLatestBackup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { wallet } = req;
            try {
                const response = yield this.service.getLatestBackup(wallet.id);
                res.json(response);
            }
            catch (err) {
                return next(err);
            }
        });
    }
}
exports.WalletController = WalletController;
