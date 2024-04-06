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
exports.WalletTransaction1681824220209 = void 0;
class WalletTransaction1681824220209 {
    constructor() {
        this.name = "WalletTransaction1681824220209";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM \`transaction\``);
            yield queryRunner.query(`DROP TABLE IF EXISTS \`wallets_txs\``);
            yield queryRunner.query(`CREATE TABLE \`wallets_txs\` (\`walletId\` varchar(64) NOT NULL, \`txId\` varchar(255) NOT NULL, INDEX \`IDX_c1438e8a3508da56c1895fe3dd\` (\`walletId\`), INDEX \`IDX_9ce29e7a19c0ec883f1ca588f0\` (\`txId\`), PRIMARY KEY (\`walletId\`, \`txId\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`transaction\` ADD \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE \`transaction\` ADD \`lastUpdated\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            yield queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`status\``);
            yield queryRunner.query(`ALTER TABLE \`transaction\` ADD \`status\` varchar(255) NOT NULL`);
            yield queryRunner.query(`CREATE INDEX \`IDX_63f749fc7f7178ae1ad85d3b95\` ON \`transaction\` (\`status\`)`);
            yield queryRunner.query(`CREATE INDEX \`IDX_83cb622ce2d74c56db3e0c29f1\` ON \`transaction\` (\`createdAt\`)`);
            yield queryRunner.query(`CREATE INDEX \`IDX_4da9d9ce7ed17b792136e4521c\` ON \`transaction\` (\`lastUpdated\`)`);
            yield queryRunner.query(`ALTER TABLE \`wallets_txs\` ADD CONSTRAINT \`FK_c1438e8a3508da56c1895fe3ddd\` FOREIGN KEY (\`walletId\`) REFERENCES \`wallet\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE \`wallets_txs\` ADD CONSTRAINT \`FK_9ce29e7a19c0ec883f1ca588f09\` FOREIGN KEY (\`txId\`) REFERENCES \`transaction\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`wallets_txs\` DROP FOREIGN KEY \`FK_9ce29e7a19c0ec883f1ca588f09\``);
            yield queryRunner.query(`ALTER TABLE \`wallets_txs\` DROP FOREIGN KEY \`FK_c1438e8a3508da56c1895fe3ddd\``);
            yield queryRunner.query(`DROP INDEX \`IDX_4da9d9ce7ed17b792136e4521c\` ON \`transaction\``);
            yield queryRunner.query(`DROP INDEX \`IDX_83cb622ce2d74c56db3e0c29f1\` ON \`transaction\``);
            yield queryRunner.query(`DROP INDEX \`IDX_63f749fc7f7178ae1ad85d3b95\` ON \`transaction\``);
            yield queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`status\``);
            yield queryRunner.query(`ALTER TABLE \`transaction\` ADD \`status\` text NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`lastUpdated\``);
            yield queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`createdAt\``);
            yield queryRunner.query(`DROP INDEX \`IDX_9ce29e7a19c0ec883f1ca588f0\` ON \`wallets_txs\``);
            yield queryRunner.query(`DROP INDEX \`IDX_c1438e8a3508da56c1895fe3dd\` ON \`wallets_txs\``);
            yield queryRunner.query(`DROP TABLE \`wallets_txs\``);
        });
    }
}
exports.WalletTransaction1681824220209 = WalletTransaction1681824220209;
