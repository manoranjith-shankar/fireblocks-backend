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
const message_subscriber_1 = require("./message.subscriber");
const transaction_1 = require("../model/transaction");
const passphrase_1 = require("../model/passphrase");
describe("message subscriber", () => {
    const deviceId = "123";
    const physicalDeviceId = "333";
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const conn = yield (0, typeorm_1.createConnection)({
            type: "better-sqlite3",
            database: ":memory:",
            dropSchema: true,
            subscribers: [message_subscriber_1.MessageSubscriber],
            entities: [wallet_1.Wallet, device_1.Device, message_1.Message, user_1.User, transaction_1.Transaction, passphrase_1.Passphrase],
            synchronize: true,
            logging: false,
        });
        yield conn.synchronize();
        const user = new user_1.User();
        user.sub = "sub";
        yield user.save();
        const wallet = new wallet_1.Wallet();
        wallet.id = "zzz";
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
    it("should resolve wait for messages on message insert", () => __awaiter(void 0, void 0, void 0, function* () {
        const sub = new message_subscriber_1.MessageSubscriber();
        const prom = sub.waitForMessages(deviceId, 20000);
        const msg = new message_1.Message();
        msg.deviceId = deviceId;
        msg.message = "hi";
        expect(msg.lastSeen).toBeUndefined();
        yield msg.save();
        expect(msg.lastSeen).toBeDefined();
        const recv = yield prom;
        expect(recv[0]).toMatchObject(msg);
    }));
    it("should resolve wait for messages on message insert physical device", () => __awaiter(void 0, void 0, void 0, function* () {
        const sub = new message_subscriber_1.MessageSubscriber();
        const prom = sub.waitForMessages(deviceId, 20000, physicalDeviceId);
        const msg = new message_1.Message();
        msg.deviceId = deviceId;
        msg.message = "hi";
        msg.physicalDeviceId = physicalDeviceId;
        expect(msg.lastSeen).toBeUndefined();
        yield msg.save();
        expect(msg.lastSeen).toBeDefined();
        const recv = yield prom;
        expect(recv[0]).toMatchObject(msg);
    }));
});
