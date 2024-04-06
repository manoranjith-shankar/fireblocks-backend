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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const device_1 = require("./device");
let Message = class Message extends typeorm_1.BaseEntity {
};
exports.Message = Message;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Message.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: false, length: 64 }),
    __metadata("design:type", String)
], Message.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true, length: 64 }),
    __metadata("design:type", String)
], Message.prototype, "physicalDeviceId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => device_1.Device, (device) => device.msgs),
    (0, typeorm_1.JoinColumn)([{ name: "deviceId", referencedColumnName: "id" }]),
    __metadata("design:type", device_1.Device)
], Message.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        type: process.env.NODE_ENV === "test" ? "text" : "longtext",
    }),
    __metadata("design:type", String)
], Message.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "datetime", nullable: true, name: "last_seen" }),
    __metadata("design:type", Date)
], Message.prototype, "lastSeen", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Message.prototype, "updatedAt", void 0);
exports.Message = Message = __decorate([
    (0, typeorm_1.Entity)()
], Message);
