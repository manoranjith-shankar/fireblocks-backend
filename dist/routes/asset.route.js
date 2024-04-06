"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssetRoute = void 0;
const express_1 = require("express");
const asset_controller_1 = require("../controllers/asset.controller");
const asset_service_1 = require("../services/asset.service");
function createAssetRoute(clients) {
    const route = (0, express_1.Router)({ mergeParams: true });
    const service = new asset_service_1.AssetService(clients);
    const controller = new asset_controller_1.AssetController(service);
    route.get("/", controller.findAll.bind(controller));
    route.get("/summary", controller.summary.bind(controller));
    route.get("/supported_assets", controller.getSupportedAssets.bind(controller));
    route.post("/:assetId", controller.addAsset.bind(controller));
    route.get("/:assetId", controller.findOne.bind(controller));
    route.get("/:assetId/balance", controller.getBalance.bind(controller));
    route.get("/:assetId/address", controller.getAddress.bind(controller));
    return route;
}
exports.createAssetRoute = createAssetRoute;
