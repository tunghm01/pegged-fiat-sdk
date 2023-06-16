"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountState = exports.AccountName = exports.accountsCoder = exports.PeggedFiatIDL = void 0;
const anchor_1 = require("@project-serum/anchor");
const pegged_fiat_json_1 = __importDefault(require("../artifacts/pegged_fiat.json"));
exports.PeggedFiatIDL = pegged_fiat_json_1.default;
exports.accountsCoder = new anchor_1.AccountsCoder(exports.PeggedFiatIDL);
var AccountName;
(function (AccountName) {
    AccountName["Controller"] = "Controller";
    AccountName["Pair"] = "Pair";
    AccountName["UserProfile"] = "UserProfile";
    AccountName["LockProfile"] = "LockProfile";
})(AccountName = exports.AccountName || (exports.AccountName = {}));
exports.AccountState = {
    Unknown: { unknown: {} },
    Active: { active: {} },
    Inactive: { inactive: {} },
};
