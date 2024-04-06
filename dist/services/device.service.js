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
exports.DeviceService = void 0;
const device_1 = require("../model/device");
const user_1 = require("../model/user");
const wallet_1 = require("../model/wallet");
class DeviceService {
    constructor(clients) {
        this.clients = clients;
    }
    findOne(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield device_1.Device.findOne({
                where: { id: deviceId },
                relations: { user: true },
            });
        });
    }
    findAll(sub, walletId, dir = "ASC") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield device_1.Device.find({
                where: { walletId, user: { sub } },
                relations: { user: true },
                order: {
                    createdAt: dir,
                },
            });
        });
    }
    assign(deviceId, sub) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findOneByOrFail({ sub });
            const { walletId } = yield this.clients.admin.NCW.createWallet();
            // note: creating a default first account
            yield this.clients.admin.NCW.createWalletAccount(walletId);
            const wallet = new wallet_1.Wallet();
            wallet.id = walletId;
            const device = new device_1.Device();
            device.id = deviceId;
            device.wallet = wallet;
            device.user = user;
            yield device.save();
            return { walletId };
        });
    }
    join(deviceId, sub, walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findOneByOrFail({ sub });
            const wallet = yield wallet_1.Wallet.findOneByOrFail({
                id: walletId,
                devices: {
                    user: {
                        sub,
                    },
                },
            });
            const device = new device_1.Device();
            device.id = deviceId;
            device.wallet = wallet;
            device.user = user;
            yield device.save();
            return { walletId };
        });
    }
    rpc(walletId, deviceId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.clients.signer.NCW.invokeWalletRpc(walletId, deviceId, message);
            return response;
        });
    }
}
exports.DeviceService = DeviceService;
