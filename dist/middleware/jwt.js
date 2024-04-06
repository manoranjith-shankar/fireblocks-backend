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
exports.checkJwt = void 0;
const jose_1 = require("jose");
function extractToken(req) {
    if (req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
    else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}
const checkJwt = ({ key, verify }) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = extractToken(req);
    if (!token || typeof token !== "string") {
        res.send(401);
        return;
    }
    try {
        const { payload } = yield (0, jose_1.jwtVerify)(token, key, verify);
        req.auth = { token, payload };
        next();
    }
    catch (e) {
        res.send(401);
    }
});
exports.checkJwt = checkJwt;
