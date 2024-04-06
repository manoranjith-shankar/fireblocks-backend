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
const typeorm_1 = require("typeorm");
const device_1 = require("../model/device");
const message_1 = require("../model/message");
const user_1 = require("../model/user");
const wallet_1 = require("../model/wallet");
const transaction_1 = require("../model/transaction");
const transaction_subscriber_1 = require("./transaction.subscriber");
const transaction_2 = require("../interfaces/transaction");
const fireblocks_sdk_1 = require("fireblocks-sdk");
const passphrase_1 = require("../model/passphrase");
describe("transaction subscriber", () => {
    const walletId = "33";
    const deviceId = "123";
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const conn = yield (0, typeorm_1.createConnection)({
            type: "better-sqlite3",
            database: ":memory:",
            dropSchema: true,
            subscribers: [transaction_subscriber_1.TransactionSubscriber],
            entities: [wallet_1.Wallet, device_1.Device, message_1.Message, user_1.User, transaction_1.Transaction, passphrase_1.Passphrase],
            synchronize: true,
            logging: false,
        });
        yield conn.synchronize();
        const user = new user_1.User();
        user.sub = "sub";
        yield user.save();
        const wallet = new wallet_1.Wallet();
        wallet.id = walletId;
        yield wallet.save();
        const device = new device_1.Device();
        device.id = deviceId;
        device.userId = user.id;
        device.walletId = wallet.id;
        yield device.save();
    }));
    afterEach(() => {
        const conn = (0, typeorm_1.getConnection)();
        return conn.close();
    });
    it("should resolve wait for txs on message insert", () => __awaiter(void 0, void 0, void 0, function* () {
        const sub = new transaction_subscriber_1.TransactionSubscriber();
        const prom = sub.waitForTransactions(walletId, 20000);
        const txId = "122";
        const payload = createTx(txId, walletId);
        const tx = new transaction_1.Transaction();
        tx.id = txId;
        tx.status = payload.status;
        tx.details = payload;
        tx.createdAt = new Date();
        tx.lastUpdated = new Date();
        const wallet = yield wallet_1.Wallet.findOneOrFail({ where: { id: walletId } });
        tx.wallets = [wallet];
        yield tx.save();
        const recv = yield prom;
        expect(recv[0]).toMatchObject(tx);
    }));
    it("should resolve wait for txs on message update", () => __awaiter(void 0, void 0, void 0, function* () {
        const sub = new transaction_subscriber_1.TransactionSubscriber();
        const prom = sub.waitForTransactions(walletId, 20000, [
            fireblocks_sdk_1.TransactionStatus.COMPLETED,
        ]);
        const txId = "122";
        const payload = createTx(txId, walletId);
        const tx = new transaction_1.Transaction();
        tx.id = txId;
        tx.status = payload.status;
        tx.details = payload;
        tx.createdAt = new Date();
        tx.lastUpdated = new Date();
        const wallet = yield wallet_1.Wallet.findOneOrFail({ where: { id: walletId } });
        tx.wallets = [wallet];
        yield tx.save();
        tx.lastUpdated = new Date();
        tx.status = fireblocks_sdk_1.TransactionStatus.COMPLETED;
        yield tx.save();
        const recv = yield prom;
        expect(recv[0]).toMatchObject(tx);
    }));
    it("should resolve wait for txs on insert with status", () => __awaiter(void 0, void 0, void 0, function* () {
        const sub = new transaction_subscriber_1.TransactionSubscriber();
        const prom = sub.waitForTransactions(walletId, 20000, [
            fireblocks_sdk_1.TransactionStatus.SUBMITTED,
            fireblocks_sdk_1.TransactionStatus.BLOCKED,
        ]);
        const txId = "123";
        const payload = createTx(txId, walletId);
        const tx = new transaction_1.Transaction();
        tx.id = txId;
        tx.status = payload.status;
        tx.details = payload;
        tx.createdAt = new Date();
        tx.lastUpdated = new Date();
        const wallet = yield wallet_1.Wallet.findOneOrFail({ where: { id: walletId } });
        tx.wallets = [wallet];
        yield tx.save();
        const recv = yield prom;
        expect(recv[0]).toMatchObject(tx);
    }));
});
function createTx(txId, walletId) {
    return {
        id: txId,
        createdAt: new Date().valueOf(),
        lastUpdated: new Date().valueOf(),
        assetId: "BTC_TEST",
        source: {
            id: "0",
            type: fireblocks_sdk_1.PeerType.END_USER_WALLET,
            walletId,
            name: "External",
            subType: "",
        },
        destination: {
            id: "0",
            type: fireblocks_sdk_1.PeerType.VAULT_ACCOUNT,
            name: "Default",
            subType: "",
        },
        amount: 0.00001,
        networkFee: 0.00000141,
        netAmount: 0.00001,
        sourceAddress: "tb1q5c3y5g4mm2ge6zvavtvwzuc7nl9jt5knvk36sk",
        destinationAddress: "tb1qrscwnskfaejtthnh4ds8h4wu6fcxhhgfjj2xay",
        destinationAddressDescription: "",
        destinationTag: "",
        status: fireblocks_sdk_1.TransactionStatus.SUBMITTED,
        txHash: "0ca2e172b36359687981786114034e4c89379b23cd5137b1b6b0f9ee41d90669",
        subStatus: transaction_2.TransactionSubStatus.PENDING_BLOCKCHAIN_CONFIRMATIONS,
        signedBy: [],
        createdBy: "",
        rejectedBy: "",
        amountUSD: 0,
        addressType: "",
        note: "",
        exchangeTxId: "",
        requestedAmount: 0.00001,
        feeCurrency: "BTC_TEST",
        operation: fireblocks_sdk_1.TransactionOperation.TRANSFER,
        customerRefId: "123",
        numOfConfirmations: 0,
        amountInfo: {
            amount: "0.00001",
            requestedAmount: "0.00001",
            netAmount: "0.00001",
            amountUSD: undefined,
        },
        feeInfo: { networkFee: "0.00000141" },
        destinations: [],
        blockInfo: { blockHash: undefined },
        signedMessages: [],
        index: 1,
    };
}
