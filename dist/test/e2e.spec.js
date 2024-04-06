"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const crypto_1 = __importStar(require("crypto"));
const util_1 = __importDefault(require("util"));
const app_1 = require("../app");
const typeorm_1 = require("typeorm");
const device_1 = require("../model/device");
const message_1 = require("../model/message");
const user_1 = require("../model/user");
const wallet_1 = require("../model/wallet");
const fireblocks_sdk_1 = require("fireblocks-sdk");
const ts_mockito_1 = require("ts-mockito");
const jsonwebtoken_1 = require("jsonwebtoken");
const message_subscriber_1 = require("../subscribers/message.subscriber");
const transaction_1 = require("../model/transaction");
const transaction_subscriber_1 = require("../subscribers/transaction.subscriber");
const mockQuoteResponse_1 = require("./mockQuoteResponse");
const assetInfo_mock_1 = require("./assetInfo.mock");
const mockInfoResponse_1 = require("./mockInfoResponse");
const passphrase_1 = require("../model/passphrase");
const server_1 = require("../server");
const nft_mock_1 = require("./nft.mock");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const generateKeyPair = util_1.default.promisify(crypto_1.default.generateKeyPair);
const sub = "user@test.com";
const walletId = "123";
const deviceId = "010";
const algorithm = "HS256";
const secret = "test-secret";
const issuer = "test-issuer";
const audience = "test-audience";
const opts = {
    key: () => crypto_1.default.createSecretKey(secret, "utf8"),
    verify: {
        issuer,
        audience,
        algorithms: [algorithm],
    },
};
function signJwt(payload) {
    return (0, jsonwebtoken_1.sign)(payload, secret, {
        algorithm,
        issuer,
        audience,
        expiresIn: "1h",
    });
}
const port = 12312;
describe("e2e", () => {
    const fireblocksSdk = (0, ts_mockito_1.mock)();
    const ncw = (0, ts_mockito_1.mock)();
    (0, ts_mockito_1.when)(fireblocksSdk.NCW).thenReturn((0, ts_mockito_1.instance)(ncw));
    const cmc = (0, ts_mockito_1.mock)();
    const accessToken = signJwt({ sub });
    (0, ts_mockito_1.when)(cmc.latestQuotes((0, ts_mockito_1.anything)())).thenResolve((0, mockQuoteResponse_1.mockQuoteResponse)(1, ...Object.keys(assetInfo_mock_1.assetInfoMock)));
    (0, ts_mockito_1.when)(cmc.info((0, ts_mockito_1.anything)())).thenResolve((0, mockInfoResponse_1.mockInfoResponse)(...Object.keys(assetInfo_mock_1.assetInfoMock)));
    let publicKey, privateKey;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const pair = yield generateKeyPair("rsa", {
            modulusLength: 1024,
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            },
        });
        publicKey = pair.publicKey;
        privateKey = pair.privateKey;
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const conn = yield (0, typeorm_1.createConnection)({
            type: "better-sqlite3",
            database: ":memory:",
            dropSchema: true,
            subscribers: [message_subscriber_1.MessageSubscriber, transaction_subscriber_1.TransactionSubscriber],
            entities: [wallet_1.Wallet, device_1.Device, message_1.Message, user_1.User, transaction_1.Transaction, passphrase_1.Passphrase],
            synchronize: true,
            logging: false,
        });
        yield conn.synchronize();
        const container = (0, app_1.createApp)(opts, {
            admin: (0, ts_mockito_1.instance)(fireblocksSdk),
            signer: (0, ts_mockito_1.instance)(fireblocksSdk),
            cmc: (0, ts_mockito_1.instance)(cmc),
        }, publicKey, server_1.DEFAULT_ORIGIN);
        app = container.app;
        ioServer = container.socketIO;
        ioServer.listen(port);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((res) => ioServer === null || ioServer === void 0 ? void 0 : ioServer.close(res));
        const conn = (0, typeorm_1.getConnection)();
        yield conn.close();
    }));
    let app;
    let ioServer;
    function createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app)
                .post("/api/login")
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function createWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, ts_mockito_1.when)(ncw.createWallet()).thenResolve({ walletId, enabled: true });
            (0, ts_mockito_1.when)(ncw.createWalletAccount(walletId)).thenResolve({
                walletId,
                accountId: 0,
            });
            yield (0, supertest_1.default)(app)
                .post(`/api/devices/${deviceId}/assign`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200, { walletId });
        });
    }
    function getDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function getAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/${deviceId}/accounts/${0}/assets`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function getAsset(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/${deviceId}/accounts/${0}/assets/${assetId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function getAssetAddress(asset) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/${deviceId}/accounts/${0}/assets/${asset}/address`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function getAssetSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/${deviceId}/accounts/${0}/assets/summary`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function getPassphrases() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/passphrase/`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function createPassphrase(passphraseId, location) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .post(`/api/passphrase/${passphraseId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ location })
                .expect(200);
        });
    }
    function getPassphrase(passphraseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/passphrase/${passphraseId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function invokeRpc() {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = JSON.stringify({ foo: "bar" });
            (0, ts_mockito_1.when)(ncw.invokeWalletRpc(walletId, deviceId, payload)).thenResolve({
                result: "ok",
            });
            yield (0, supertest_1.default)(app)
                .post(`/api/devices/${deviceId}/rpc`)
                .send({ message: payload })
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200, { result: "ok" });
        });
    }
    function getTransactions(status, poll) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams();
            if (status) {
                status.forEach((s) => params.append("status", s));
            }
            if (poll !== undefined) {
                params.append("poll", String(poll));
            }
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/${deviceId}/transactions?${params}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function getTransaction(txId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/${deviceId}/transactions/${txId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function getMessages(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams();
            if (timeout !== undefined) {
                params.append("timeout", String(timeout));
            }
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/${deviceId}/messages?${params}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function deleteMessage(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .delete(`/api/devices/${deviceId}/messages/${messageId}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function getWallets() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/wallets/`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function getLatestBackup(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/wallets/${walletId}/backup/latest`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function getOwnedNFTs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/${deviceId}/accounts/${0}/nfts/ownership/tokens`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function listOwnedCollections() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/${deviceId}/nfts/ownership/collections`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    function listOwnedAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(app)
                .get(`/api/devices/${deviceId}/nfts/ownership/assets`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);
        });
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    function webhookPush(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const signer = crypto_1.default.createSign("RSA-SHA512");
            signer.update(JSON.stringify(payload));
            const signature = signer.sign(privateKey, "base64");
            return yield (0, supertest_1.default)(app)
                .post(`/api/webhook`)
                .send(payload)
                .set("fireblocks-signature", signature)
                .expect(200);
        });
    }
    function webhookMessage(message = "foo") {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "NCW_DEVICE_MESSAGE",
                timestamp: Date().valueOf(),
                walletId,
                deviceId,
                data: {
                    message,
                },
            };
            yield webhookPush(payload);
        });
    }
    function webhookTransaction(txId = (0, crypto_1.randomUUID)(), type = "TRANSACTION_CREATED", status = fireblocks_sdk_1.TransactionStatus.CONFIRMING) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type,
                timestamp: new Date().valueOf(),
                data: {
                    id: txId,
                    createdAt: new Date().valueOf(),
                    lastUpdated: new Date().valueOf(),
                    assetId: "BTC_TEST",
                    source: {
                        id: "0",
                        type: "END_USER_WALLET",
                        walletId,
                        name: "External",
                        subType: "",
                    },
                    destination: {
                        id: "0",
                        type: "VAULT_ACCOUNT",
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
                    status: status,
                    txHash: "0ca2e172b36359687981786114034e4c89379b23cd5137b1b6b0f9ee41d90669",
                    subStatus: "PENDING_BLOCKCHAIN_CONFIRMATIONS",
                    signedBy: [],
                    createdBy: "",
                    rejectedBy: "",
                    amountUSD: 0,
                    addressType: "",
                    note: "",
                    exchangeTxId: "",
                    requestedAmount: 0.00001,
                    feeCurrency: "BTC_TEST",
                    operation: "TRANSFER",
                    customerRefId: null,
                    numOfConfirmations: 0,
                    amountInfo: {
                        amount: "0.00001",
                        requestedAmount: "0.00001",
                        netAmount: "0.00001",
                        amountUSD: null,
                    },
                    feeInfo: { networkFee: "0.00000141" },
                    destinations: [],
                    externalTxId: null,
                    blockInfo: { blockHash: null },
                    signedMessages: [],
                    index: 1,
                    assetType: "BASE_ASSET",
                },
            };
            yield webhookPush(payload);
        });
    }
    it("should not allow unauthorized", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).post("/api/login").expect(401);
    }));
    it("should create user", () => __awaiter(void 0, void 0, void 0, function* () {
        yield createUser();
        const user = yield user_1.User.findOneBy({ sub });
        expect(user === null || user === void 0 ? void 0 : user.hasId).toBeTruthy();
    }));
    it("should create wallet", () => __awaiter(void 0, void 0, void 0, function* () {
        yield createUser();
        yield createWallet();
        const wallet = yield wallet_1.Wallet.findOneBy({ id: walletId });
        expect(wallet === null || wallet === void 0 ? void 0 : wallet.hasId).toBeTruthy();
    }));
    it("should invoke rpc", () => __awaiter(void 0, void 0, void 0, function* () {
        yield createUser();
        yield createWallet();
        yield invokeRpc();
    }));
    it("should get devices", () => __awaiter(void 0, void 0, void 0, function* () {
        yield createUser();
        {
            const { body } = yield getDevices();
            expect(body).toMatchObject({
                devices: [],
            });
        }
        yield createWallet();
        {
            const { body } = yield getDevices();
            expect(body).toMatchObject({
                devices: [
                    {
                        deviceId,
                        walletId,
                    },
                ],
            });
        }
    }));
    it("should handle empty msgs", () => __awaiter(void 0, void 0, void 0, function* () {
        yield createUser();
        yield createWallet();
        const { body } = yield getMessages(1);
        expect(body).toHaveLength(0);
    }));
    it("should handle msgs", () => __awaiter(void 0, void 0, void 0, function* () {
        yield createUser();
        yield createWallet();
        yield webhookMessage();
        const { body } = yield getMessages();
        expect(body).toHaveLength(1);
        const { body: body2 } = yield getMessages(1);
        expect(body2).toHaveLength(0);
        const msg = body[0];
        expect(msg.id).toBeDefined();
        expect(msg.message).toBeDefined();
        yield deleteMessage(msg.id);
        expect((yield getMessages(1)).body).toHaveLength(0);
    }));
    it("should return incoming messages immediately", () => __awaiter(void 0, void 0, void 0, function* () {
        yield createUser();
        yield createWallet();
        const msgProm = getMessages(20);
        yield webhookMessage();
        yield msgProm;
    }));
    it("should handle transactions", () => __awaiter(void 0, void 0, void 0, function* () {
        const txId = "txId123";
        const txId2 = "txId1234";
        yield createUser();
        yield createWallet();
        expect((yield getTransactions()).body).toEqual([]);
        yield webhookTransaction(txId, "TRANSACTION_CREATED", fireblocks_sdk_1.TransactionStatus.CONFIRMING);
        expect((yield getTransactions()).body).toMatchObject([{ id: txId }]);
        yield webhookTransaction(txId, "TRANSACTION_STATUS_UPDATED", fireblocks_sdk_1.TransactionStatus.PENDING_SIGNATURE);
        expect((yield getTransactions([fireblocks_sdk_1.TransactionStatus.CONFIRMING])).body).toEqual([]);
        expect((yield getTransaction(txId)).body).toMatchObject({
            id: txId,
            status: fireblocks_sdk_1.TransactionStatus.PENDING_SIGNATURE,
        });
        yield webhookTransaction(txId2, "TRANSACTION_CREATED", fireblocks_sdk_1.TransactionStatus.SUBMITTED);
        expect((yield getTransactions([
            fireblocks_sdk_1.TransactionStatus.CANCELLED,
            fireblocks_sdk_1.TransactionStatus.CONFIRMING,
            fireblocks_sdk_1.TransactionStatus.PENDING_SIGNATURE,
            fireblocks_sdk_1.TransactionStatus.SUBMITTED,
        ])).body).toHaveLength(2);
    }));
    it("should handle polling transactions", () => __awaiter(void 0, void 0, void 0, function* () {
        const txId = "txId123";
        yield createUser();
        yield createWallet();
        expect((yield getTransactions()).body).toEqual([]);
        const poll1 = getTransactions([fireblocks_sdk_1.TransactionStatus.CONFIRMING], true);
        const poll2 = getTransactions([fireblocks_sdk_1.TransactionStatus.CONFIRMING, fireblocks_sdk_1.TransactionStatus.PENDING_SIGNATURE], true);
        const poll3 = getTransactions(undefined, true);
        yield webhookTransaction(txId, "TRANSACTION_CREATED", fireblocks_sdk_1.TransactionStatus.CONFIRMING);
        expect((yield poll1).body).toMatchObject([{ id: txId }]);
        expect((yield poll2).body).toMatchObject([{ id: txId }]);
        expect((yield poll3).body).toMatchObject([{ id: txId }]);
    }));
    it("should get assets", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, ts_mockito_1.when)(fireblocksSdk.getFeeForAsset((0, ts_mockito_1.anything)())).thenResolve({
            low: {},
            medium: {},
            high: {},
        });
        (0, ts_mockito_1.when)(ncw.getWalletAssets(walletId, 0, (0, ts_mockito_1.anything)())).thenResolve({
            data: Object.values(assetInfo_mock_1.assetInfoMock),
        });
        yield createUser();
        yield createWallet();
        yield getAssets();
    }));
    it("should get asset", () => __awaiter(void 0, void 0, void 0, function* () {
        const assetId = "BTC_TEST";
        (0, ts_mockito_1.when)(fireblocksSdk.getFeeForAsset((0, ts_mockito_1.anything)())).thenResolve({
            low: {},
            medium: {},
            high: {},
        });
        (0, ts_mockito_1.when)(ncw.getWalletAsset(walletId, 0, assetId)).thenResolve(assetInfo_mock_1.assetInfoMock[assetId]);
        yield createUser();
        yield createWallet();
        expect((yield getAsset(assetId)).body.id).toBe(assetId);
    }));
    it("should get asset address", () => __awaiter(void 0, void 0, void 0, function* () {
        const asset = "BTC_TEST";
        const address = {
            accountName: walletId,
            accountId: "0",
            asset,
            address: "123",
            addressType: "aaa",
        };
        (0, ts_mockito_1.when)(ncw.getWalletAssetAddresses(walletId, 0, asset)).thenResolve({
            data: [address],
        });
        yield createUser();
        yield createWallet();
        expect((yield getAssetAddress(asset)).body).toEqual(address);
    }));
    it("should get asset summary", () => __awaiter(void 0, void 0, void 0, function* () {
        const asset = "BTC_TEST";
        const address = {
            accountName: walletId,
            accountId: "0",
            asset,
            address: "123",
            addressType: "aaa",
        };
        const balance = {
            id: "aaa",
            total: "0",
        };
        (0, ts_mockito_1.when)(fireblocksSdk.getFeeForAsset((0, ts_mockito_1.anything)())).thenResolve({
            low: {},
            medium: {},
            high: {},
        });
        (0, ts_mockito_1.when)(ncw.getWalletAssets(walletId, 0, (0, ts_mockito_1.anything)())).thenResolve({
            data: Object.values(assetInfo_mock_1.assetInfoMock),
        });
        (0, ts_mockito_1.when)(ncw.getWalletAssetAddresses(walletId, 0, (0, ts_mockito_1.anyString)())).thenResolve({
            data: [address],
        });
        (0, ts_mockito_1.when)(ncw.getWalletAssetBalance(walletId, 0, (0, ts_mockito_1.anyString)())).thenResolve(balance);
        yield createUser();
        yield createWallet();
        const { body } = yield getAssetSummary();
        expect(Object.keys(body)).toEqual(Object.keys(assetInfo_mock_1.assetInfoMock));
        for (const [id, entry] of Object.entries(body)) {
            expect(entry.balance).toEqual(balance);
            expect(entry.address).toEqual(address);
            expect(entry.asset.id).toEqual(id);
        }
    }));
    it("should be able to save and get passphrase info", () => __awaiter(void 0, void 0, void 0, function* () {
        yield createUser();
        const passphraseId = crypto_1.default.randomUUID();
        const location = passphrase_1.PassphraseLocation.GoogleDrive;
        yield createPassphrase(passphraseId, location);
        const passphrase = yield getPassphrase(passphraseId);
        expect(passphrase.body).toEqual({ location });
        const passphrases = yield getPassphrases();
        expect(passphrases.body.passphrases[0]).toEqual(expect.objectContaining({
            passphraseId,
            location,
        }));
    }));
    it("should be able to get latest backup with passphrase location", () => __awaiter(void 0, void 0, void 0, function* () {
        yield createUser();
        yield createWallet();
        expect((yield getWallets()).body).toEqual({ wallets: [{ walletId }] });
        const passphraseId = crypto_1.default.randomUUID();
        const location = passphrase_1.PassphraseLocation.GoogleDrive;
        yield createPassphrase(passphraseId, location);
        (0, ts_mockito_1.when)(ncw.getLatestBackup(walletId)).thenResolve({
            passphraseId,
            createdAt: 0,
            keys: [
                {
                    deviceId,
                    keyId: "123",
                    publicKey,
                    algorithm,
                },
            ],
        });
        expect((yield getLatestBackup(walletId)).body).toEqual({
            passphraseId,
            deviceId,
            location,
            createdAt: 0,
        });
    }));
    describe("nft", () => {
        it("should get owned nfts", () => __awaiter(void 0, void 0, void 0, function* () {
            (0, ts_mockito_1.when)(fireblocksSdk.getOwnedNFTs((0, ts_mockito_1.anything)())).thenResolve({
                data: nft_mock_1.ownedNftsMock,
            });
            yield createUser();
            yield createWallet();
            const ownedNfts = yield getOwnedNFTs();
            expect(ownedNfts.body).toEqual(nft_mock_1.ownedNftsMock);
        }));
        it("should list owned collection", () => __awaiter(void 0, void 0, void 0, function* () {
            (0, ts_mockito_1.when)(fireblocksSdk.listOwnedCollections((0, ts_mockito_1.anything)())).thenResolve({
                data: nft_mock_1.ownedCollectionsMock,
            });
            yield createUser();
            yield createWallet();
            const ownedCollections = yield listOwnedCollections();
            expect(ownedCollections.body).toEqual(nft_mock_1.ownedCollectionsMock);
        }));
        it("should list owned assets", () => __awaiter(void 0, void 0, void 0, function* () {
            (0, ts_mockito_1.when)(fireblocksSdk.listOwnedAssets((0, ts_mockito_1.anything)())).thenResolve({
                data: nft_mock_1.ownedAssetsMock,
            });
            yield createUser();
            yield createWallet();
            const ownedAssets = yield listOwnedAssets();
            expect(ownedAssets.body).toEqual(nft_mock_1.ownedAssetsMock);
        }));
    });
    describe("socketio", () => {
        test("authenticated socket rpc", () => __awaiter(void 0, void 0, void 0, function* () {
            yield createUser();
            yield createWallet();
            const client = (0, socket_io_client_1.default)(`http://localhost:${port}`, {
                autoConnect: false,
                auth: (cb) => cb({ token: signJwt({ sub }) }),
            });
            const connected = new Promise((res) => client.once("connect", res));
            client.connect();
            yield connected;
            const payload = JSON.stringify({ foo: "bar" });
            (0, ts_mockito_1.when)(ncw.invokeWalletRpc(walletId, deviceId, payload)).thenResolve({
                result: "ok",
            });
            const resp = yield client.emitWithAck("rpc", deviceId, payload);
            expect(resp).toEqual({ result: "ok" });
        }));
        test("unauthenticated socket rpc should be disconnected", () => __awaiter(void 0, void 0, void 0, function* () {
            yield createUser();
            yield createWallet();
            const client = (0, socket_io_client_1.default)(`http://localhost:${port}`, {
                autoConnect: false,
            });
            const connected = new Promise((res) => client.once("connect", res));
            const disconnected = new Promise((res) => client.once("disconnect", (reason) => res(reason)));
            client.connect();
            yield connected;
            expect(yield disconnected).toEqual("io server disconnect");
        }));
    });
});
