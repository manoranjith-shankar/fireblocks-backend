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
exports.TransactionService = void 0;
const typeorm_1 = require("typeorm");
const transaction_1 = require("../model/transaction");
class TransactionService {
    constructor(signer) {
        this.signer = signer;
    }
    findOne(txId, walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_1.Transaction.findOne({
                where: {
                    id: txId,
                    wallets: { id: walletId },
                },
            });
        });
    }
    find(walletId, orderBy, startDate, endDate, statuses, dir, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_1.Transaction.find({
                where: {
                    wallets: {
                        id: walletId,
                    },
                    [orderBy]: (0, typeorm_1.And)((0, typeorm_1.MoreThan)(startDate), (0, typeorm_1.LessThan)(endDate)),
                    status: statuses ? (0, typeorm_1.In)(statuses) : undefined,
                },
                order: { [orderBy]: dir },
                skip,
                take,
            });
        });
    }
    estimate(walletId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { low, medium, high } = yield this.signer.estimateFeeForTransaction(args, { ncw: { walletId } });
            return { low, medium, high };
        });
    }
    create(walletId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, status } = yield this.signer.createTransaction(args, {
                ncw: { walletId },
            });
            return { id, status };
        });
    }
    cancel(walletId, txId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { success } = yield this.signer.cancelTransactionById(txId, {
                ncw: { walletId },
            });
            return { success };
        });
    }
}
exports.TransactionService = TransactionService;
