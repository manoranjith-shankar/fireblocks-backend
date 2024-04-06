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
const ts_mockito_1 = require("ts-mockito");
const patchTransactionAmountUsd_1 = require("./patchTransactionAmountUsd");
const fireblocks_sdk_1 = require("fireblocks-sdk");
const transaction_1 = require("../../interfaces/transaction");
const mockQuoteResponse_1 = require("../../test/mockQuoteResponse");
function createTx(txId, walletId) {
    return {
        id: txId,
        createdAt: new Date().valueOf(),
        lastUpdated: new Date().valueOf(),
        assetId: "ETH_TEST",
        source: {
            id: "0",
            type: fireblocks_sdk_1.PeerType.END_USER_WALLET,
            walletId,
            name: "External",
            subType: "",
        },
        destination: {
            id: "0",
            type: fireblocks_sdk_1.PeerType.VAULT_ACCOUNT,
            name: "Default",
            subType: "",
        },
        amount: 0.00001,
        networkFee: 0.00000141,
        netAmount: 0.00001,
        sourceAddress: "tb1q5c3y5g4mm2ge6zvavtvwzuc7nl9jt5knvk36sk",
        destinationAddress: "tb1qrscwnskfaejtthnh4ds8h4wu6fcxhhgfjj2xay",
        destinationAddressDescription: "",
        destinationTag: "",
        status: fireblocks_sdk_1.TransactionStatus.SUBMITTED,
        txHash: "0ca2e172b36359687981786114034e4c89379b23cd5137b1b6b0f9ee41d90669",
        subStatus: transaction_1.TransactionSubStatus.PENDING_BLOCKCHAIN_CONFIRMATIONS,
        signedBy: [],
        createdBy: "",
        rejectedBy: "",
        amountUSD: 0,
        addressType: "",
        note: "",
        exchangeTxId: "",
        requestedAmount: 0.00001,
        feeCurrency: "ETH_TEST",
        operation: fireblocks_sdk_1.TransactionOperation.TRANSFER,
        customerRefId: "123",
        numOfConfirmations: 0,
        amountInfo: {
            amount: "0.00001",
            requestedAmount: "0.00001",
            netAmount: "0.00001",
            amountUSD: undefined,
        },
        feeInfo: { networkFee: "0.00000141" },
        destinations: [],
        blockInfo: { blockHash: undefined },
        signedMessages: [],
        index: 1,
    };
}
describe("patchTransactionAmountUsd", () => {
    it("patchTransactionAmountUsd", () => __awaiter(void 0, void 0, void 0, function* () {
        const cmc = (0, ts_mockito_1.mock)();
        const price = 2.5;
        (0, ts_mockito_1.when)(cmc.latestQuotes((0, ts_mockito_1.anything)())).thenResolve((0, mockQuoteResponse_1.mockQuoteResponse)(price, "ETH"));
        const tx = createTx("123", "333");
        expect(tx.amountUSD).toBe(0);
        yield (0, patchTransactionAmountUsd_1.patchTransactionAmountUsd)(tx, (0, ts_mockito_1.instance)(cmc));
        expect(tx.amountUSD).not.toBe(0);
        expect(tx.amountUSD).toBe(price * tx.amount);
    }));
});
