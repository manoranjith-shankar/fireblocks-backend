"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const typeorm_1 = require("typeorm");
const wallet_1 = require("./wallet");
const fireblocks_sdk_1 = require("fireblocks-sdk");
let Transaction = class Transaction extends typeorm_1.BaseEntity {
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false, length: 255 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "datetime",
        nullable: false,
        default: () => "NOW(6)",
        precision: 6,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "datetime",
        nullable: false,
        default: () => "NOW(6)",
        precision: 6,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Transaction.prototype, "lastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        // note: during tests we use typeorm with sqlite which doesn't support "json" columns
        type: process.env.NODE_ENV === "test" ? "simple-json" : "json",
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => wallet_1.Wallet, (wallet) => wallet.transactions),
    __metadata("design:type", Array)
], Transaction.prototype, "wallets", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)()
], Transaction);
