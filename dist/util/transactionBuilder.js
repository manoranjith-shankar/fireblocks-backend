"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTestTypedDataArgs = exports.buildAccountTransferArgs = exports.buildOnetimeAddressTransferArgs = void 0;
const fireblocks_sdk_1 = require("fireblocks-sdk");
const typedData_1 = require("./typedData");
function buildOnetimeAddressTransferArgs(destAddress, amount, feeLevel, gasLimit) {
    return {
        operation: fireblocks_sdk_1.TransactionOperation.TRANSFER,
        destination: {
            type: fireblocks_sdk_1.PeerType.ONE_TIME_ADDRESS,
            oneTimeAddress: { address: destAddress },
        },
        amount,
        feeLevel,
        gasLimit,
    };
}
exports.buildOnetimeAddressTransferArgs = buildOnetimeAddressTransferArgs;
function buildAccountTransferArgs(walletId, accountId, amount, feeLevel, gasLimit) {
    return {
        operation: fireblocks_sdk_1.TransactionOperation.TRANSFER,
        destination: {
            type: fireblocks_sdk_1.PeerType.END_USER_WALLET,
            id: accountId,
            walletId,
        },
        amount,
        feeLevel,
        gasLimit,
    };
}
exports.buildAccountTransferArgs = buildAccountTransferArgs;
function buildTestTypedDataArgs() {
    return {
        operation: fireblocks_sdk_1.TransactionOperation.TYPED_MESSAGE,
        extraParameters: {
            rawMessageData: {
                messages: [
                    {
                        type: "EIP712",
                        content: (0, typedData_1.buildTypedData)(),
                    },
                ],
            },
        },
    };
}
exports.buildTestTypedDataArgs = buildTestTypedDataArgs;
