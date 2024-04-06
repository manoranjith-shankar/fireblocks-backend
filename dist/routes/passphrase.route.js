"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPassphraseRoute = void 0;
const express_1 = require("express");
const passphrase_service_1 = require("../services/passphrase.service");
const passphrase_controller_1 = require("../controllers/passphrase.controller");
function createPassphraseRoute() {
    const service = new passphrase_service_1.PassphraseService();
    const controller = new passphrase_controller_1.PassphraseController(service);
    const route = (0, express_1.Router)({ mergeParams: true });
    route.get("/", controller.findAll.bind(controller));
    route.post("/:passphraseId", controller.create.bind(controller));
    route.get("/:passphraseId", controller.findOne.bind(controller));
    return route;
}
exports.createPassphraseRoute = createPassphraseRoute;
