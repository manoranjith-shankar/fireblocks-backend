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
exports.MessageCleanup1691618893123 = void 0;
class MessageCleanup1691618893123 {
    constructor() {
        this.name = "MessageCleanup1691618893123";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`TRUNCATE TABLE \`message\``);
            yield queryRunner.query(`ALTER TABLE \`message\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`message\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`CREATE INDEX \`IDX_d39ce1e9b866435541a5dab809\` ON \`message\` (\`deviceId\`)`);
            yield queryRunner.query(`CREATE INDEX \`IDX_58181a9d6e6905a52d366f8e9f\` ON \`message\` (\`last_seen\`)`);
            yield queryRunner.query(`CREATE INDEX \`IDX_19d7362db248a3df27fc29b507\` ON \`message\` (\`createdAt\`)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX \`IDX_19d7362db248a3df27fc29b507\` ON \`message\``);
            yield queryRunner.query(`DROP INDEX \`IDX_58181a9d6e6905a52d366f8e9f\` ON \`message\``);
            yield queryRunner.query(`DROP INDEX \`IDX_d39ce1e9b866435541a5dab809\` ON \`message\``);
            yield queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`updatedAt\``);
            yield queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`createdAt\``);
        });
    }
}
exports.MessageCleanup1691618893123 = MessageCleanup1691618893123;
