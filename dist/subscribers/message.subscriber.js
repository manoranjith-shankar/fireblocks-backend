"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSubscriber = void 0;
const typeorm_1 = require("typeorm");
const message_1 = require("../model/message");
const events_1 = __importDefault(require("events"));
const abortError_1 = require("../util/abortError");
const emitter = new events_1.default();
let MessageSubscriber = class MessageSubscriber {
    listenTo() {
        return message_1.Message;
    }
    afterInsert(event) {
        // note: when running this server in multiple instances this event should be distributed to all nodes
        emitter.emit(`message:${event.entity.deviceId}`, event.entity);
        if (event.entity.physicalDeviceId) {
            emitter.emit(`message:${event.entity.deviceId}:${event.entity.physicalDeviceId}`, event.entity);
        }
    }
    waitForMessages(deviceId, timeout, physicalDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new AbortController();
            const promise = physicalDeviceId
                ? events_1.default.once(emitter, `message:${deviceId}:${physicalDeviceId}`, {
                    signal: controller.signal,
                })
                : events_1.default.once(emitter, `message:${deviceId}`, {
                    signal: controller.signal,
                });
            const timer = setTimeout(controller.abort.bind(controller), timeout);
            try {
                const msg = (yield promise)[0];
                clearTimeout(timer);
                msg.lastSeen = new Date();
                const result = yield message_1.Message.update({ id: msg.id, lastSeen: (0, typeorm_1.IsNull)() }, { lastSeen: msg.lastSeen });
                if (result.affected) {
                    return [msg];
                }
                else {
                    return [];
                }
            }
            catch (error) {
                if ((0, abortError_1.isAbortError)(error)) {
                    return [];
                }
                throw error;
            }
        });
    }
};
exports.MessageSubscriber = MessageSubscriber;
exports.MessageSubscriber = MessageSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], MessageSubscriber);
