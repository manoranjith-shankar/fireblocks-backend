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
exports.handleWalletEventMessage = exports.handleNcwDeviceMessage = exports.handleTransactionCreated = exports.handleTransactionStatusUpdated = void 0;
const device_1 = require("../model/device");
const fireblocks_sdk_1 = require("fireblocks-sdk");
const typeorm_1 = require("typeorm");
const message_1 = require("../model/message");
const wallet_1 = require("../model/wallet");
const transaction_1 = require("../model/transaction");
function handleTransactionStatusUpdated(id, status, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const tx = yield transaction_1.Transaction.findOneOrFail({
            where: { id },
            relations: { wallets: true },
        });
        tx.status = status;
        tx.details = data;
        tx.lastUpdated = new Date(data.lastUpdated);
        yield tx.save();
    });
}
exports.handleTransactionStatusUpdated = handleTransactionStatusUpdated;
function handleTransactionCreated(id, status, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const tx = new transaction_1.Transaction();
        tx.id = id;
        tx.status = status;
        tx.createdAt = new Date(data.createdAt);
        tx.lastUpdated = new Date(data.lastUpdated);
        tx.details = data;
        const wallets = new Set([
            data.source,
            data.destination,
            ...[...(data.destinations ? data.destinations : [])].map((d) => d.destination),
        ]
            .filter((p) => p.type === fireblocks_sdk_1.PeerType.END_USER_WALLET)
            .map((p) => p.walletId));
        if (wallets.size) {
            tx.wallets = yield wallet_1.Wallet.find({
                where: { id: (0, typeorm_1.In)([...wallets.values()]) },
            });
        }
        else {
            tx.wallets = [];
        }
        yield tx.save();
    });
}
exports.handleTransactionCreated = handleTransactionCreated;
function handleNcwDeviceMessage(deviceId, walletId, physicalDeviceId, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
data) {
    return __awaiter(this, void 0, void 0, function* () {
        const device = yield device_1.Device.findOne({
            where: {
                id: deviceId,
                walletId,
            },
        });
        if (!device) {
            console.warn("ignoring NCW Device message for unknown deviceId", deviceId);
            return;
        }
        const msg = new message_1.Message();
        msg.device = device;
        msg.physicalDeviceId = physicalDeviceId;
        msg.message = JSON.stringify(data);
        yield msg.save();
    });
}
exports.handleNcwDeviceMessage = handleNcwDeviceMessage;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleWalletEventMessage(event, payload) {
    console.log(`Received wallet event: ${event} with payload: ${JSON.stringify(payload)}`);
}
exports.handleWalletEventMessage = handleWalletEventMessage;
