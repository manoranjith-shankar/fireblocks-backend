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
exports.Web3Controller = void 0;
const fireblocks_sdk_1 = require("fireblocks-sdk");
class Web3Controller {
    constructor(service) {
        this.service = service;
    }
    find(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device } = req;
            try {
                const { walletId } = device;
                const connections = yield this.service.find(walletId);
                return res.json(connections);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, body } = req;
            const { uri, accountId = "0", feeLevel = fireblocks_sdk_1.Web3ConnectionFeeLevel.MEDIUM, } = body;
            try {
                const { walletId } = device;
                const session = yield this.service.create(walletId, Number(accountId), uri, feeLevel);
                res.json(session);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    approve(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { sessionId } = params;
            try {
                const { walletId } = device;
                yield this.service.approve(walletId, sessionId);
                return res.json({ success: true });
            }
            catch (err) {
                return next(err);
            }
        });
    }
    deny(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { sessionId } = params;
            try {
                const { walletId } = device;
                yield this.service.deny(walletId, sessionId);
                return res.json({ success: true });
            }
            catch (err) {
                return next(err);
            }
        });
    }
    remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device, params } = req;
            const { sessionId } = params;
            try {
                const { walletId } = device;
                yield this.service.remove(walletId, sessionId);
                return res.json({ success: true });
            }
            catch (err) {
                return next(err);
            }
        });
    }
}
exports.Web3Controller = Web3Controller;
