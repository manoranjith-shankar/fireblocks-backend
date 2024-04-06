"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNFTRoutes = void 0;
const express_1 = require("express");
const nft_controller_1 = require("../controllers/nft.controller");
const nft_service_1 = require("../services/nft.service");
function createNFTRoutes(clients) {
    const walletNFTRoute = (0, express_1.Router)({ mergeParams: true });
    const accountNFTRoute = (0, express_1.Router)({ mergeParams: true });
    const service = new nft_service_1.NFTService(clients);
    const controller = new nft_controller_1.NFTController(service);
    // requires walletId and accountId
    accountNFTRoute.get("/ownership/tokens", controller.getOwnedNFTs.bind(controller));
    // requires walletId
    walletNFTRoute.get("/ownership/collections", controller.listOwnedCollections.bind(controller));
    walletNFTRoute.get("/ownership/assets", controller.listOwnedAssets.bind(controller));
    return { walletNFTRoute, accountNFTRoute };
}
exports.createNFTRoutes = createNFTRoutes;
