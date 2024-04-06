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
exports.DatePrecision1699354090663 = void 0;
class DatePrecision1699354090663 {
    constructor() {
        this.name = "DatePrecision1699354090663";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`createdAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`lastUpdated\` \`lastUpdated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`lastUpdated\` \`lastUpdated\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`createdAt\` \`createdAt\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        });
    }
}
exports.DatePrecision1699354090663 = DatePrecision1699354090663;
