"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.TransactionSubscriber = void 0;
const typeorm_1 = require("typeorm");
const events_1 = __importDefault(require("events"));
const transaction_1 = require("../model/transaction");
const abortError_1 = require("../util/abortError");
const emitter = new events_1.default();
let TransactionSubscriber = class TransactionSubscriber {
    listenTo() {
        return transaction_1.Transaction;
    }
    getWalletKey(walletId) {
        return `wallet:${walletId}`;
    }
    getWalletStatusKey(walletId, status) {
        return `wallet:${walletId}:${status}`;
    }
    afterInsert(event) {
        // note: when running this server in multiple instances this event should be distributed to all nodes
        for (const wallet of event.entity.wallets) {
            emitter.emit(this.getWalletKey(wallet.id), event.entity);
            emitter.emit(this.getWalletStatusKey(wallet.id, event.entity.status), event.entity);
        }
    }
    afterUpdate(event) {
        var _a;
        // note: when running this server in multiple instances this event should be distributed to all nodes
        if (event.entity !== undefined) {
            for (const wallet of event.entity.wallets) {
                emitter.emit(this.getWalletKey(wallet.id), event.entity);
                emitter.emit(this.getWalletStatusKey(wallet.id, (_a = event.entity) === null || _a === void 0 ? void 0 : _a.status), event.entity);
            }
        }
    }
    waitForTransactions(walletId, timeout, statuses) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new AbortController();
            const promise = statuses
                ? Promise.race(statuses.map((status) => events_1.default.once(emitter, this.getWalletStatusKey(walletId, status), { signal: controller.signal })))
                : events_1.default.once(emitter, this.getWalletKey(walletId), {
                    signal: controller.signal,
                });
            const timer = setTimeout(controller.abort.bind(controller), timeout);
            try {
                const result = yield promise;
                clearTimeout(timer);
                // abort others
                if (statuses) {
                    controller.abort();
                }
                const txs = result.filter((s) => !!s);
                return txs;
            }
            catch (error) {
                if ((0, abortError_1.isAbortError)(error)) {
                    return [];
                }
                throw error;
            }
        });
    }
};
exports.TransactionSubscriber = TransactionSubscriber;
exports.TransactionSubscriber = TransactionSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], TransactionSubscriber);
