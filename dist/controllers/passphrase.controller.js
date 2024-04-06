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
exports.PassphraseController = void 0;
const passphrase_1 = require("../model/passphrase");
class PassphraseController {
    constructor(service) {
        this.service = service;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { auth, params } = req;
            const { passphraseId } = params;
            const { sub } = auth.payload;
            const { location } = req.body;
            try {
                if (typeof location !== "string" || !(location in passphrase_1.PassphraseLocation)) {
                    return res.status(400).send("Invalid location");
                }
                yield this.service.create(sub, passphraseId, location);
                res.json({ passphraseId });
            }
            catch (err) {
                next(err);
            }
        });
    }
    findOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { auth, params } = req;
            const { passphraseId } = params;
            const { sub } = auth.payload;
            try {
                const passphrase = yield this.service.findOne(sub, passphraseId);
                if (!passphrase) {
                    return res.status(404).send("Not found");
                }
                res.json({
                    location: passphrase.location,
                });
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
                const passphrases = yield this.service.findAll(sub);
                res.json({
                    passphrases: passphrases.map(({ id, createdAt, location }) => ({
                        passphraseId: id,
                        location,
                        createdAt: createdAt.valueOf(),
                    })),
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.PassphraseController = PassphraseController;
