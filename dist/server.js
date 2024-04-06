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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ORIGIN = void 0;
const app_1 = require("./app");
const fireblocks_sdk_1 = require("fireblocks-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("./data-source");
const coinmarketcap_js_1 = __importDefault(require("coinmarketcap-js"));
const ms_1 = __importDefault(require("ms"));
const message_service_1 = require("./services/message.service");
const env_1 = require("./util/env");
const agentkeepalive_1 = require("agentkeepalive");
const jose_1 = require("jose");
const openid_client_1 = require("openid-client");
// use keepalive agent to reuse connections to Fireblocks API
const keepaliveAgent = new agentkeepalive_1.HttpsAgent({
    keepAlive: true,
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
});
dotenv_1.default.config();
const port = process.env.PORT;
exports.DEFAULT_ORIGIN = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://fireblocks.github.io",
];
function getOriginFromEnv() {
    if (process.env.ORIGIN_WEB_SDK !== undefined) {
        const origin = process.env.ORIGIN_WEB_SDK;
        return origin.split(",");
    }
    return exports.DEFAULT_ORIGIN;
}
const webhookPublicKey = (0, env_1.getEnvOrThrow)("FIREBLOCKS_WEBHOOK_PUBLIC_KEY").replace(/\\n/g, "\n");
const apiSecret = (0, env_1.getEnvOrThrow)("FIREBLOCKS_API_SECRET").replace(/\\n/g, "\n");
const apiKeyCmc = (0, env_1.getEnvOrThrow)("CMC_PRO_API_KEY");
const apiKeyNcwSigner = (0, env_1.getEnvOrThrow)("FIREBLOCKS_API_KEY_NCW_SIGNER");
const apiKeyNcwAdmin = (0, env_1.getEnvOrThrow)("FIREBLOCKS_API_KEY_NCW_ADMIN");
const apiBase = process.env.FIREBLOCKS_API_BASE_URL;
const signer = new fireblocks_sdk_1.FireblocksSDK(apiSecret, apiKeyNcwSigner, apiBase, undefined, { httpsAgent: keepaliveAgent });
const admin = new fireblocks_sdk_1.FireblocksSDK(apiSecret, apiKeyNcwAdmin, apiBase, undefined, {
    httpsAgent: keepaliveAgent,
});
// You must provide either an 'issuerBaseURL', or an 'issuer' and 'jwksUri'
const issuerBaseURL = process.env.ISSUER_BASE_URL;
const issuer = process.env.ISSUER;
const jwksUri = process.env.JWKS_URI;
const audience = process.env.AUDIENCE;
const clients = {
    signer,
    admin,
    cmc: (0, coinmarketcap_js_1.default)(apiKeyCmc).crypto,
};
const origin = getOriginFromEnv();
data_source_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Data Source has been initialized!");
    const authOptions = yield createAuthOptions();
    const { app, socketIO } = (0, app_1.createApp)(authOptions, clients, webhookPublicKey, origin);
    const server = app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
        // should be distributed scheduled task in production
        setInterval(() => {
            void (0, message_service_1.staleMessageCleanup)();
        }, (0, ms_1.default)("1 hour"));
    });
    // set higher keepalive timeout (default: 5s)
    server.keepAliveTimeout = 60000;
    socketIO.attach(server, {
        cors: {
            origin,
            methods: ["GET", "POST"],
        },
    });
}))
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
    process.exit(1);
});
function createAuthOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        let authOptions;
        if (issuerBaseURL) {
            const issuerClient = yield openid_client_1.Issuer.discover(issuerBaseURL);
            authOptions = {
                key: (0, jose_1.createRemoteJWKSet)(new URL(issuerClient.metadata.jwks_uri)),
                verify: {
                    issuer: issuerClient.metadata.issuer,
                    audience,
                },
            };
        }
        else if (jwksUri) {
            authOptions = {
                key: (0, jose_1.createRemoteJWKSet)(new URL(jwksUri)),
                verify: {
                    issuer,
                    audience,
                },
            };
        }
        else {
            throw new Error("Failed to resolve issuer");
        }
        return authOptions;
    });
}
