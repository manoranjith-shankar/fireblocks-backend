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
exports.PassphraseService = void 0;
const user_1 = require("../model/user");
const passphrase_1 = require("../model/passphrase");
class PassphraseService {
    findOne(sub, passphraseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield passphrase_1.Passphrase.findOne({
                where: { id: passphraseId, user: { sub } },
                relations: { user: true },
            });
        });
    }
    findAll(sub, dir = "ASC") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield passphrase_1.Passphrase.find({
                where: { user: { sub } },
                relations: { user: true },
                order: {
                    createdAt: dir,
                },
            });
        });
    }
    create(sub, id, location) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findOneByOrFail({ sub });
            const passphrase = new passphrase_1.Passphrase();
            passphrase.id = id;
            passphrase.location = location;
            passphrase.user = user;
            const { id: passphraseId } = yield passphrase.save();
            return { passphraseId };
        });
    }
}
exports.PassphraseService = PassphraseService;
