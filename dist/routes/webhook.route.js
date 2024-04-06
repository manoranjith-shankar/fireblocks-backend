"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebhook = void 0;
const express_1 = require("express");
const webhook_1 = require("../middleware/webhook");
const webhook_controller_1 = require("../controllers/webhook.controller");
function createWebhook(clients, publicKey) {
    const contoller = new webhook_controller_1.WebhookController(clients);
    const route = (0, express_1.Router)({ mergeParams: true });
    route.post("/", (0, webhook_1.validateWebhook)(publicKey), contoller.handle.bind(contoller));
    return route;
}
exports.createWebhook = createWebhook;
