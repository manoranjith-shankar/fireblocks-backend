"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const device_1 = require("./model/device");
const message_1 = require("./model/message");
const user_1 = require("./model/user");
const wallet_1 = require("./model/wallet");
const transaction_1 = require("./model/transaction");
const message_subscriber_1 = require("./subscribers/message.subscriber");
const transaction_subscriber_1 = require("./subscribers/transaction.subscriber");
const passphrase_1 = require("./model/passphrase");
dotenv_1.default.config();
const opts = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [user_1.User, wallet_1.Wallet, device_1.Device, message_1.Message, transaction_1.Transaction, passphrase_1.Passphrase],
    subscribers: [message_subscriber_1.MessageSubscriber, transaction_subscriber_1.TransactionSubscriber],
    migrations: ["./dist/migrations/*.js"],
};
exports.default = opts;
