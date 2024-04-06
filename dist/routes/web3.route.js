"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWeb3Route = void 0;
const express_1 = require("express");
const web3_service_1 = require("../services/web3.service");
const web3_controller_1 = require("../controllers/web3.controller");
function createWeb3Route({ signer }) {
    const route = (0, express_1.Router)({ mergeParams: true });
    const service = new web3_service_1.Web3Service(signer);
    const controller = new web3_controller_1.Web3Controller(service);
    route.get("/connections/", controller.find.bind(controller));
    route.post("/connections/", controller.create.bind(controller));
    route.post("/connections/:sessionId/approve", controller.approve.bind(controller));
    route.post("/connections/:sessionId/deny", controller.deny.bind(controller));
    route.delete("/connections/:sessionId", controller.remove.bind(controller));
    return route;
}
exports.createWeb3Route = createWeb3Route;
