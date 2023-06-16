"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsableController = exports.ParsableLockProfile = exports.ParsableUserProfile = exports.ParsablePair = void 0;
const anchor_1 = require("@project-serum/anchor");
const types_1 = require("../types");
/**
 * Class decorator to define an interface with static methods
 * Reference: https://github.com/Microsoft/TypeScript/issues/13462#issuecomment-295685298
 */
function staticImplements() {
    return (constructor) => {
        constructor;
    };
}
function parseAnchorAccount(accountName, data) {
    const discriminator = anchor_1.AccountsCoder.accountDiscriminator(accountName);
    if (discriminator.compare(data.slice(0, 8))) {
        console.error("incorrect account name during parsing");
        return null;
    }
    try {
        return types_1.accountsCoder.decode(accountName, data);
    }
    catch (_e) {
        console.error("unknown account name during parsing");
        return null;
    }
}
// YOUR ACCOUNTS
let ParsablePair = class ParsablePair {
    constructor() { }
    static parse(data) {
        if (!data) {
            return null;
        }
        try {
            return parseAnchorAccount(types_1.AccountName.Pair, data);
        }
        catch (e) {
            console.error(`error while parsing Pair: ${e}`);
            return null;
        }
    }
};
ParsablePair = __decorate([
    staticImplements()
], ParsablePair);
exports.ParsablePair = ParsablePair;
let ParsableUserProfile = class ParsableUserProfile {
    constructor() { }
    static parse(data) {
        if (!data) {
            return null;
        }
        try {
            return parseAnchorAccount(types_1.AccountName.UserProfile, data);
        }
        catch (e) {
            console.error(`error while parsing UserProfile: ${e}`);
            return null;
        }
    }
};
ParsableUserProfile = __decorate([
    staticImplements()
], ParsableUserProfile);
exports.ParsableUserProfile = ParsableUserProfile;
let ParsableLockProfile = class ParsableLockProfile {
    constructor() { }
    static parse(data) {
        if (!data) {
            return null;
        }
        try {
            return parseAnchorAccount(types_1.AccountName.LockProfile, data);
        }
        catch (e) {
            console.error(`error while parsing LockProfile: ${e}`);
            return null;
        }
    }
};
ParsableLockProfile = __decorate([
    staticImplements()
], ParsableLockProfile);
exports.ParsableLockProfile = ParsableLockProfile;
let ParsableController = class ParsableController {
    constructor() { }
    static parse(data) {
        if (!data) {
            return null;
        }
        try {
            return parseAnchorAccount(types_1.AccountName.Controller, data);
        }
        catch (e) {
            console.error(`error while parsing Controller: ${e}`);
            return null;
        }
    }
};
ParsableController = __decorate([
    staticImplements()
], ParsableController);
exports.ParsableController = ParsableController;
