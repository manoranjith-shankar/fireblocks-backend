"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWebhook = void 0;
const crypto_1 = __importDefault(require("crypto"));
const validateWebhook = (publicKey) => (req, res, next) => {
    const message = JSON.stringify(req.body);
    const signature = req.headers["fireblocks-signature"];
    if (typeof signature !== "string") {
        next(new Error(`Invalid signature`));
        return;
    }
    const verifier = crypto_1.default.createVerify("RSA-SHA512");
    verifier.write(message);
    verifier.end();
    const isVerified = verifier.verify(publicKey, signature, "base64");
    if (isVerified) {
        next();
    }
    else {
        next(new Error(`Invalid signature`));
    }
};
exports.validateWebhook = validateWebhook;
