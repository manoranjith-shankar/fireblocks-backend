"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletRoute = void 0;
const express_1 = require("express");
const wallet_1 = require("../middleware/wallet");
const wallet_service_1 = require("../services/wallet.service");
const wallet_controller_1 = require("../controllers/wallet.controller");
function createWalletRoute(clients) {
    const service = new wallet_service_1.WalletService(clients);
    const controller = new wallet_controller_1.WalletController(service);
    const route = (0, express_1.Router)({ mergeParams: true });
    route.get("/", controller.findAll.bind(controller));
    route.use("/:walletId", wallet_1.validateWallet);
    route.use("/:walletId/backup/latest", controller.getLatestBackup.bind(controller));
    return route;
}
exports.createWalletRoute = createWalletRoute;
