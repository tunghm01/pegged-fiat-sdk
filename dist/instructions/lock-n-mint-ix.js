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
exports.lockNMint = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
function lockNMint(program, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { accounts, inputs } = params;
        const ix = yield program.instruction.lockNMint(params.inputs.lockAmount, params.inputs.userProfileBump, params.inputs.lockProfileBump, {
            accounts: Object.assign(Object.assign({}, accounts), { tokenProgram: spl_token_1.TOKEN_PROGRAM_ID, systemProgram: web3_js_1.SystemProgram.programId, rent: web3_js_1.SYSVAR_RENT_PUBKEY, associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID }),
        });
        return {
            instructions: [ix],
            cleanupInstructions: [],
            signers: [],
        };
    });
}
exports.lockNMint = lockNMint;
