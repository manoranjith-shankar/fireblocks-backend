"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageRoute = void 0;
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
function createMessageRoute() {
    const route = (0, express_1.Router)({ mergeParams: true });
    const controller = new message_controller_1.MessageController();
    route.get("/", controller.findMany.bind(controller));
    route.delete("/:messageId", controller.deleteOne.bind(controller));
    return route;
}
exports.createMessageRoute = createMessageRoute;
