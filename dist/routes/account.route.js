"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccountsRoute = void 0;
const express_1 = require("express");
const asset_route_1 = require("./asset.route");
const account_contoller_1 = require("../controllers/account.contoller");
function createAccountsRoute(clients, nftRoute) {
    const assets = (0, asset_route_1.createAssetRoute)(clients);
    const controller = new account_contoller_1.AccountContoller(clients);
    const route = (0, express_1.Router)({ mergeParams: true });
    route.get("/", controller.findAll.bind(controller));
    route.use("/:accountId/assets/", assets);
    route.use("/:accountId/nfts/", nftRoute);
    return route;
}
exports.createAccountsRoute = createAccountsRoute;
