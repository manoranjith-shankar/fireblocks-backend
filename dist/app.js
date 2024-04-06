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
exports.createApp = exports.waitForTransactionTimeout = exports.visibilityTimeout = void 0;
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const jwt_1 = require("./middleware/jwt");
const device_route_1 = require("./routes/device.route");
const webhook_route_1 = require("./routes/webhook.route");
const user_controller_1 = require("./controllers/user.controller");
const user_service_1 = require("./services/user.service");
const errorHandler_1 = require("./middleware/errorHandler");
const passphrase_route_1 = require("./routes/passphrase.route");
const wallet_route_1 = require("./routes/wallet.route");
const socket_io_1 = require("socket.io");
const device_1 = require("./model/device");
const jose_1 = require("jose");
const logger = (0, morgan_1.default)("combined");
exports.visibilityTimeout = 120000;
exports.waitForTransactionTimeout = 10000;
function createApp(authOpts, clients, webhookPublicKey, origin) {
    const validateUser = (0, jwt_1.checkJwt)(authOpts);
    const walletRoute = (0, wallet_route_1.createWalletRoute)(clients);
    const { route: deviceRoute, service: deviceService } = (0, device_route_1.createDeviceRoute)(clients);
    const passphraseRoute = (0, passphrase_route_1.createPassphraseRoute)();
    const webhookRoute = (0, webhook_route_1.createWebhook)(clients, webhookPublicKey);
    const userContoller = new user_controller_1.UserController(new user_service_1.UserService());
    const app = (0, express_1.default)();
    app.use(logger);
    app.use((0, cors_1.default)({
        origin,
        maxAge: 600,
    }));
    app.use(body_parser_1.default.json({ limit: "50mb" }));
    app.get("/", (req, res) => res.send("OK"));
    app.post("/api/login", validateUser, userContoller.login.bind(userContoller));
    app.use("/api/passphrase", validateUser, passphraseRoute);
    app.use("/api/devices", validateUser, deviceRoute);
    app.use("/api/wallets", validateUser, walletRoute);
    app.use("/api/webhook", webhookRoute);
    app.use(errorHandler_1.errorHandler);
    const socketIO = new socket_io_1.Server();
    socketIO.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const token = (_b = (_a = socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token;
        const { verify, key } = authOpts;
        try {
            if (!token) {
                throw new Error("no token provided");
            }
            const payload = yield (0, jose_1.jwtVerify)(token, key, verify);
            socket.handshake.auth.payload = payload;
        }
        catch (e) {
            console.error("failed authenticating socket", e);
            socket.disconnect(true);
            return;
        }
        socket.on("rpc", (deviceId, message, cb) => __awaiter(this, void 0, void 0, function* () {
            const { payload } = socket.handshake.auth;
            const device = yield device_1.Device.findOne({
                where: { id: deviceId, user: { sub: payload.sub } },
            });
            if (!device) {
                cb({ error: { message: "Device not found" } });
                return;
            }
            try {
                const response = yield deviceService.rpc(device.walletId, deviceId, message);
                cb(response);
                return;
            }
            catch (e) {
                console.error("failed invoking RPC", e);
                cb({
                    error: {
                        message: "Failed invoking RPC",
                        code: -1,
                    },
                });
                return;
            }
        }));
    }));
    return { app, socketIO };
}
exports.createApp = createApp;
