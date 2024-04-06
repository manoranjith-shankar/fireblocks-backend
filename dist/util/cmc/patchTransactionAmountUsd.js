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
exports.patchTransactionAmountUsd = void 0;
const getUsdRate_1 = require("./getUsdRate");
function patchTransactionAmountUsd(data, cmc) {
    return __awaiter(this, void 0, void 0, function* () {
        // transactions of testnet assets don't have USD rates, so we patch the amount with real asset USD rates for mock
        if (!data.amountUSD && data.amount) {
            // TODO: get asset symbol from supported assets
            const rate = yield (0, getUsdRate_1.getUsdRateForAsset)(data.assetId, cmc);
            if (rate) {
                data.amountUSD = rate * data.amount;
            }
        }
    });
}
exports.patchTransactionAmountUsd = patchTransactionAmountUsd;
