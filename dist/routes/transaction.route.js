"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionRoute = void 0;
const express_1 = require("express");
const transaction_subscriber_1 = require("../subscribers/transaction.subscriber");
const transaction_service_1 = require("../services/transaction.service");
const transaction_controller_1 = require("../controllers/transaction.controller");
function createTransactionRoute({ signer }) {
    const txSubscriber = new transaction_subscriber_1.TransactionSubscriber();
    const route = (0, express_1.Router)({ mergeParams: true });
    const service = new transaction_service_1.TransactionService(signer);
    const controller = new transaction_controller_1.TransactionController(service, txSubscriber);
    route.get("/", controller.find.bind(controller));
    route.post("/", controller.create.bind(controller));
    route.get("/:txId", controller.findOne.bind(controller));
    route.post("/:txId/cancel", controller.cancel.bind(controller));
    return route;
}
exports.createTransactionRoute = createTransactionRoute;
