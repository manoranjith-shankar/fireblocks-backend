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
exports.MessageController = void 0;
const message_service_1 = require("../services/message.service");
class MessageController {
    findMany(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const physicalDeviceId = req.query.physicalDeviceId;
            const timeout = Number((_a = req.query.timeout) !== null && _a !== void 0 ? _a : 10);
            const batchSize = Number((_b = req.query.batchSize) !== null && _b !== void 0 ? _b : 10);
            if (timeout < 0 || timeout > 20 || !Number.isInteger(timeout)) {
                return res.status(400).send("Invalid timeout value");
            }
            if (batchSize < 1 || batchSize > 20 || !Number.isInteger(batchSize)) {
                return res.status(400).send("Invalid batchSize value");
            }
            if (physicalDeviceId !== undefined &&
                typeof physicalDeviceId !== "string") {
                return res.status(400).send("Invalid physicalDeviceId value");
            }
            try {
                const messages = yield (0, message_service_1.getMessages)(req.device.id, req.auth.payload.sub, batchSize, physicalDeviceId, timeout);
                return res.json(messages.map(({ id, message }) => ({ id, message })));
            }
            catch (err) {
                return next(err);
            }
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { auth, params, device } = req;
            const { messageId } = params;
            try {
                const { sub } = auth.payload;
                const result = yield (0, message_service_1.deleteMessage)(messageId, device.id, sub);
                if (result.affected) {
                    return res.status(200).send();
                }
                else {
                    return res.status(404).send();
                }
            }
            catch (err) {
                return next(err);
            }
        });
    }
}
exports.MessageController = MessageController;
