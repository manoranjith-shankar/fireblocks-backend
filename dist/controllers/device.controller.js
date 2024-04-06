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
exports.DeviceController = void 0;
class DeviceController {
    constructor(service) {
        this.service = service;
    }
    assign(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { auth, params } = req;
            const { sub } = auth.payload;
            const { deviceId } = params;
            try {
                // check if device was already assigned wallet
                const prevDevice = yield this.service.findOne(deviceId);
                if (prevDevice) {
                    if (prevDevice.user.sub !== sub) {
                        return res.status(401).send();
                    }
                    if (prevDevice.walletId) {
                        return res.json({ walletId: prevDevice.walletId });
                    }
                    throw new Error("Invalid state");
                }
                const { walletId } = yield this.service.assign(deviceId, sub);
                res.json({ walletId });
            }
            catch (err) {
                next(err);
            }
        });
    }
    join(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { auth, params } = req;
            const { sub } = auth.payload;
            const { deviceId } = params;
            const { walletId } = req.body;
            try {
                // check if device was already assigned wallet
                const prevDevice = yield this.service.findOne(deviceId);
                if (prevDevice) {
                    if (prevDevice.user.sub !== sub) {
                        return res.status(401).send();
                    }
                    if (prevDevice.walletId) {
                        if (prevDevice.walletId !== walletId) {
                            return res.status(409).send();
                        }
                        return res.json({ walletId: prevDevice.walletId });
                    }
                    throw new Error("Invalid state");
                }
                const { walletId: id } = yield this.service.join(deviceId, sub, walletId);
                res.json({ walletId: id });
            }
            catch (err) {
                next(err);
            }
        });
    }
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { auth } = req;
            const { sub } = auth.payload;
            try {
                const devices = yield this.service.findAll(sub);
                res.json({
                    devices: devices.map(({ id, walletId, createdAt }) => ({
                        deviceId: id,
                        walletId,
                        createdAt: createdAt.valueOf(),
                    })),
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    rpc(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params, device } = req;
            const { deviceId } = params;
            const { message } = req.body;
            try {
                const { walletId } = device;
                const response = yield this.service.rpc(walletId, deviceId, message);
                res.json(response);
            }
            catch (err) {
                return next(err);
            }
        });
    }
}
exports.DeviceController = DeviceController;
