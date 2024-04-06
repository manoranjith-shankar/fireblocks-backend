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
exports.TransactionController = void 0;
const fireblocks_sdk_1 = require("fireblocks-sdk");
const app_1 = require("../app");
const transactionBuilder_1 = require("../util/transactionBuilder");
class TransactionController {
    constructor(service, txSubscriber) {
        this.service = service;
        this.txSubscriber = txSubscriber;
    }
    cancel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { txId } = params;
            try {
                const { walletId } = device;
                const transaction = yield this.service.findOne(txId, walletId);
                if (!transaction) {
                    return res.status(404).json();
                }
                const { success } = yield this.service.cancel(walletId, txId);
                return res.json({ success });
            }
            catch (err) {
                return next(err);
            }
        });
    }
    findOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { txId } = params;
            try {
                const { walletId } = device;
                const transaction = yield this.service.findOne(txId, walletId);
                if (!transaction) {
                    return res.status(404).json();
                }
                return res.json(transaction);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    create(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { device, body } = req;
            const { assetId = "ETH_TEST3", accountId = "0", note = `API Transaction by ${(_a = req.auth) === null || _a === void 0 ? void 0 : _a.payload.sub}`, destAddress = undefined, destAccount = undefined, amount = "0.00001", feeLevel = fireblocks_sdk_1.FeeLevel.MEDIUM, gasLimit = undefined, estimateFee = false, } = body;
            try {
                const { walletId } = device;
                const base = {
                    source: {
                        type: fireblocks_sdk_1.PeerType.END_USER_WALLET,
                        walletId,
                        id: accountId,
                    },
                    assetId,
                    note,
                };
                let args;
                if (destAddress) {
                    args = (0, transactionBuilder_1.buildOnetimeAddressTransferArgs)(destAddress, amount, feeLevel, gasLimit);
                }
                else if (destAccount) {
                    args = (0, transactionBuilder_1.buildAccountTransferArgs)(walletId, destAccount, amount, feeLevel, gasLimit);
                }
                else {
                    args = (0, transactionBuilder_1.buildTestTypedDataArgs)();
                }
                if (estimateFee) {
                    const { low, medium, high } = yield this.service.estimate(walletId, Object.assign(Object.assign({}, base), args));
                    res.json({ fee: { low, medium, high } });
                }
                else {
                    const { id, status } = yield this.service.create(walletId, Object.assign(Object.assign({}, base), args));
                    res.json({ id, status });
                }
            }
            catch (err) {
                return next(err);
            }
        });
    }
    find(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, device } = req;
            const startDate = query.startDate
                ? new Date(Number(query.startDate))
                : new Date(0);
            const endDate = query.endDate
                ? new Date(Number(query.endDate))
                : new Date();
            const statuses = query.status
                ? Array.isArray(query.status)
                    ? query.status
                    : [query.status]
                : undefined;
            const skip = query.skip ? Number(query.take) : 0;
            const take = query.take ? Number(query.take) : 25;
            const poll = query.poll ? Boolean(query.poll) : false;
            const details = query.details ? Boolean(query.details) : false;
            const orderBy = query.orderBy ? String(query.orderBy) : "lastUpdated";
            const dir = query.dir ? String(query.dir).toUpperCase() : "DESC";
            if (take < 0 || /* TODO: take > 100 || */ !Number.isInteger(take)) {
                return res.status(400).send("Invalid take value");
            }
            if (skip < 0 || !Number.isInteger(skip)) {
                return res.status(400).send("Invalid skip value");
            }
            if (statuses &&
                !statuses.every((s) => Object.values(fireblocks_sdk_1.TransactionStatus).includes(s))) {
                return res.status(400).send("Invalid status value");
            }
            if (!["DESC", "ASC"].includes(dir)) {
                return res.status(400).send("Invalid dir value");
            }
            if (!["lastUpdated", "createdAt"].includes(orderBy)) {
                return res.status(400).send("Invalid orderBy value");
            }
            try {
                const { walletId } = device;
                let transactions = yield this.service.find(walletId, orderBy, startDate, endDate, statuses, dir, skip, take);
                if (!transactions.length && poll) {
                    transactions = yield this.txSubscriber.waitForTransactions(walletId, app_1.waitForTransactionTimeout, statuses);
                }
                return res.json(transactions.map(({ id, status, createdAt, lastUpdated, details: dets }) => ({
                    id,
                    status,
                    createdAt: createdAt.valueOf(),
                    lastUpdated: lastUpdated.valueOf(),
                    details: details ? dets : undefined,
                })));
            }
            catch (err) {
                return next(err);
            }
        });
    }
}
exports.TransactionController = TransactionController;
