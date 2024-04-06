"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeviceRoute = void 0;
const express_1 = require("express");
const device_1 = require("../middleware/device");
const device_controller_1 = require("../controllers/device.controller");
const account_route_1 = require("./account.route");
const message_route_1 = require("./message.route");
const transaction_route_1 = require("./transaction.route");
const device_service_1 = require("../services/device.service");
const web3_route_1 = require("./web3.route");
const compression_1 = __importDefault(require("compression"));
const nft_route_1 = require("./nft.route");
function createDeviceRoute(clients) {
    const transactionsRoute = (0, transaction_route_1.createTransactionRoute)(clients);
    const messagesRoute = (0, message_route_1.createMessageRoute)();
    const { walletNFTRoute, accountNFTRoute } = (0, nft_route_1.createNFTRoutes)(clients);
    const accountsRoute = (0, account_route_1.createAccountsRoute)(clients, accountNFTRoute);
    const web3Route = (0, web3_route_1.createWeb3Route)(clients);
    const service = new device_service_1.DeviceService(clients);
    const controller = new device_controller_1.DeviceController(service);
    const route = (0, express_1.Router)({ mergeParams: true });
    // note: no validateDevice during wallet assignment
    route.post("/:deviceId/assign", controller.assign.bind(controller));
    route.post("/:deviceId/join", controller.join.bind(controller));
    route.get("/", controller.findAll.bind(controller));
    route.use("/:deviceId", device_1.validateDevice);
    route.use("/:deviceId/transactions", transactionsRoute);
    route.use("/:deviceId/accounts", accountsRoute);
    route.use("/:deviceId/nfts", walletNFTRoute);
    route.use("/:deviceId/messages", messagesRoute);
    route.use("/:deviceId/web3", web3Route);
    route.post("/:deviceId/rpc", (0, compression_1.default)(), controller.rpc.bind(controller));
    return { route, service };
}
exports.createDeviceRoute = createDeviceRoute;
