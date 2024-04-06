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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staleMessageCleanup = exports.getMessages = exports.deleteMessage = void 0;
const message_1 = require("../model/message");
const typeorm_1 = require("typeorm");
const app_1 = require("../app");
const message_subscriber_1 = require("../subscribers/message.subscriber");
const ms_1 = __importDefault(require("ms"));
const msgSubscriber = new message_subscriber_1.MessageSubscriber();
function deleteMessage(messageId, deviceId, sub) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield message_1.Message.delete({
            id: Number(messageId),
            device: {
                id: deviceId,
                user: { sub },
            },
        });
    });
}
exports.deleteMessage = deleteMessage;
function getMessages(deviceId, sub, batchSize, physicalDeviceId, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
        const device = {
            id: deviceId,
            user: { sub },
        };
        let messages = yield message_1.Message.getRepository().manager.transaction((transactional) => __awaiter(this, void 0, void 0, function* () {
            const messages = yield transactional.find(message_1.Message, {
                take: batchSize,
                order: { id: "ASC" },
                where: [
                    // either unseen messages
                    {
                        physicalDeviceId,
                        lastSeen: (0, typeorm_1.IsNull)(),
                        device,
                    },
                    // or - messages that were last seen after a visibility timeout
                    {
                        physicalDeviceId,
                        lastSeen: (0, typeorm_1.LessThan)(new Date(Date.now() - app_1.visibilityTimeout)),
                        device,
                    },
                ],
                relations: ["device", "device.user"],
            });
            messages.forEach((m) => {
                m.lastSeen = new Date();
            });
            yield transactional.save(messages);
            return messages;
        }));
        if (messages.length === 0) {
            messages = yield msgSubscriber.waitForMessages(device.id, timeout * 1000, physicalDeviceId);
        }
        return messages;
    });
}
exports.getMessages = getMessages;
function staleMessageCleanup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stale = new Date(Date.now() - (0, ms_1.default)("3 days"));
            console.log(`cleanup: deleting stale messages: before ${stale.toDateString()}...`);
            const result = yield message_1.Message.delete({ createdAt: (0, typeorm_1.LessThan)(stale) });
            if (result.affected) {
                console.log(`cleanup: deleted ${result.affected} stale messages`);
            }
        }
        catch (e) {
            console.error("cleanup: failed", e);
        }
    });
}
exports.staleMessageCleanup = staleMessageCleanup;
