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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const patchTransactionAmountUsd_1 = require("../util/cmc/patchTransactionAmountUsd");
const webhook_service_1 = require("../services/webhook.service");
class WebhookController {
    constructor(clients) {
        this.clients = clients;
    }
    handle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, timestamp } = req.body;
                console.log(`received webhook, type: ${type} timestamp: ${timestamp} body: ${JSON.stringify(req.body)} `);
                switch (type) {
                    case "NCW_DEVICE_MESSAGE": {
                        const { walletId, deviceId, physicalDeviceId, data } = req.body;
                        yield (0, webhook_service_1.handleNcwDeviceMessage)(deviceId, walletId, physicalDeviceId, data);
                        return res.status(200).send("ok");
                    }
                    case "TRANSACTION_CREATED": {
                        const { data } = req.body;
                        const { id, status } = data;
                        yield (0, patchTransactionAmountUsd_1.patchTransactionAmountUsd)(data, this.clients.cmc);
                        yield (0, webhook_service_1.handleTransactionCreated)(id, status, data);
                        return res.status(200).send("ok");
                    }
                    case "TRANSACTION_STATUS_UPDATED": {
                        const { data } = req.body;
                        const { id, status } = data;
                        yield (0, patchTransactionAmountUsd_1.patchTransactionAmountUsd)(data, this.clients.cmc);
                        yield (0, webhook_service_1.handleTransactionStatusUpdated)(id, status, data);
                        return res.status(200).send("ok");
                    }
                    case "NCW_CREATED":
                    case "NCW_ACCOUNT_CREATED":
                    case "NCW_ASSET_CREATED":
                    case "NCW_STATUS_UPDATED":
                    case "NCW_ADD_DEVICE_SETUP_REQUESTED": {
                        yield (0, webhook_service_1.handleWalletEventMessage)(type, req.body);
                        return res.status(200).send("ok");
                    }
                    case "ON_NEW_EXTERNAL_TRANSACTION":
                    case "VAULT_ACCOUNT_ADDED":
                    case "VAULT_WALLET_READY":
                    case "UNMANAGED_WALLET_ADDED":
                    case "UNMANAGED_WALLET_REMOVED":
                    case "THIRD_PARTY_ACCOUNT_ADDED":
                    case "NETWORK_CONNECTION_ADDED":
                    case "NETWORK_CONNECTION_REMOVED":
                    case "CONFIG_CHANGE_REQUEST_STATUS":
                    case "TRANSACTION_APPROVAL_STATUS_UPDATED":
                    case "VAULT_ACCOUNT_ASSET_ADDED":
                    case "EXTERNAL_WALLET_ASSET_ADDED":
                    case "INTERNAL_WALLET_ASSET_ADDED":
                        return res.status(200).send("ok");
                    default:
                        console.error(`unknown webhook type ${type}`);
                        return res.status(400).send("error");
                }
            }
            catch (err) {
                return next(err);
            }
        });
    }
}
exports.WebhookController = WebhookController;
