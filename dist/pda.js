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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDA = exports.LOCK_PROFILE_SEED = exports.USER_PROFILE_SEED = exports.PAIR_SEED = exports.CONTROLLER = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
exports.CONTROLLER = "controller";
exports.PAIR_SEED = "pair";
exports.USER_PROFILE_SEED = "user_profile";
exports.LOCK_PROFILE_SEED = "lock_profile";
class PDA {
    constructor(programId) {
        this.controller = (version = 1) => {
            const _version = new anchor.BN(version);
            const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync([anchor.utils.bytes.utf8.encode(exports.CONTROLLER), _version.toArrayLike(Buffer, "le", 2)], this.programId);
            return {
                key: pda,
                bump: bump,
            };
        };
        this.pair = (lockToken, mintToken, version = 1) => {
            const controller = this.controller(version);
            const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync([
                anchor.utils.bytes.utf8.encode(exports.PAIR_SEED),
                controller.key.toBuffer(),
                lockToken.toBuffer(),
                mintToken.toBuffer(),
            ], this.programId);
            return {
                key: pda,
                bump: bump,
            };
        };
        this.userProfile = (user, pair) => {
            const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync([anchor.utils.bytes.utf8.encode(exports.USER_PROFILE_SEED), pair.toBuffer(), user.toBuffer()], this.programId);
            return {
                key: pda,
                bump: bump,
            };
        };
        this.lockProfile = (user, pair, index) => {
            const _index = new anchor.BN(index);
            const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync([
                anchor.utils.bytes.utf8.encode(exports.LOCK_PROFILE_SEED),
                pair.toBuffer(),
                user.toBuffer(),
                _index.toArrayLike(Buffer, "le", 2),
            ], this.programId);
            return {
                key: pda,
                bump: bump,
            };
        };
        this.programId = programId;
    }
}
exports.PDA = PDA;
