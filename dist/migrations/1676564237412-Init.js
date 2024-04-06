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
exports.Init1676564237412 = void 0;
class Init1676564237412 {
    constructor() {
        this.name = "Init1676564237412";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`deviceId\` varchar(64) NOT NULL, \`message\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sub\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_3641ff83ff7c23b2760b3df56d\` (\`sub\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`wallet\` (\`id\` varchar(64) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`device\` (\`id\` varchar(64) NOT NULL, \`userId\` int NOT NULL, \`walletId\` varchar(64) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_d39ce1e9b866435541a5dab8093\` FOREIGN KEY (\`deviceId\`) REFERENCES \`device\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`device\` ADD CONSTRAINT \`FK_69536b80ca522ea82d054ebe1b0\` FOREIGN KEY (\`walletId\`) REFERENCES \`wallet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`device\` ADD CONSTRAINT \`FK_9eb58b0b777dbc2864820228ebc\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`device\` DROP FOREIGN KEY \`FK_9eb58b0b777dbc2864820228ebc\``);
            yield queryRunner.query(`ALTER TABLE \`device\` DROP FOREIGN KEY \`FK_69536b80ca522ea82d054ebe1b0\``);
            yield queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_d39ce1e9b866435541a5dab8093\``);
            yield queryRunner.query(`DROP TABLE \`device\``);
            yield queryRunner.query(`DROP TABLE \`wallet\``);
            yield queryRunner.query(`DROP INDEX \`IDX_3641ff83ff7c23b2760b3df56d\` ON \`user\``);
            yield queryRunner.query(`DROP TABLE \`user\``);
            yield queryRunner.query(`DROP TABLE \`message\``);
        });
    }
}
exports.Init1676564237412 = Init1676564237412;
