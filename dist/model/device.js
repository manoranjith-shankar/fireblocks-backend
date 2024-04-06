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
exports.Device = void 0;
const typeorm_1 = require("typeorm");
const message_1 = require("./message");
const user_1 = require("./user");
const wallet_1 = require("./wallet");
let Device = class Device extends typeorm_1.BaseEntity {
};
exports.Device = Device;
__decorate([
    (0, typeorm_1.PrimaryColumn)("uuid", { nullable: false, length: 64 }),
    __metadata("design:type", String)
], Device.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Device.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: false, length: 64 }),
    __metadata("design:type", String)
], Device.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_1.Message, (msg) => msg.device),
    __metadata("design:type", Array)
], Device.prototype, "msgs", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wallet_1.Wallet, (wallet) => wallet.devices, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "walletId", referencedColumnName: "id" }),
    __metadata("design:type", wallet_1.Wallet)
], Device.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.devices, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "userId", referencedColumnName: "id" }),
    __metadata("design:type", user_1.User)
], Device.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Device.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Device.prototype, "updatedAt", void 0);
exports.Device = Device = __decorate([
    (0, typeorm_1.Entity)()
], Device);
