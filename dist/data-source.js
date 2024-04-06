"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const data_source_opts_1 = __importDefault(require("./data-source-opts"));
exports.AppDataSource = new typeorm_1.DataSource(data_source_opts_1.default);
