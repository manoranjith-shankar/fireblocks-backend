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
exports.validateDevice = void 0;
const device_1 = require("../model/device");
const validateDevice = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { auth, params } = req;
        const { deviceId } = params;
        try {
            const { sub } = auth.payload;
            const device = yield device_1.Device.findOneOrFail({
                where: {
                    id: deviceId,
                    user: { sub },
                },
                relations: { user: true },
            });
            req.device = device;
        }
        catch (e) {
            next(e);
            return;
        }
        next();
    });
};
exports.validateDevice = validateDevice;
