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
exports.deriveATA = exports.PairClient = void 0;
const spl_token_1 = require("@solana/spl-token");
const OracleSDK = __importStar(require("@renec-foundation/oracle-sdk"));
const __1 = require("..");
class PairClient {
    constructor(ctx, pairKey, pairData, controllerData, pda, productClient) {
        this.ctx = ctx;
        this.pairData = pairData;
        this.pairKey = pairKey;
        this.pda = pda;
        this.productClient = productClient;
        this.controllerData = controllerData;
    }
    static getPair(ctx, quote, base, version = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const pda = new __1.PDA(ctx.program.programId);
            const controller = pda.controller(version);
            const controllerData = yield ctx.fetcher.getController(controller.key);
            if (!controllerData) {
                throw new Error(`Controller of ${version} not found`);
            }
            const pair = pda.pair(quote, base, version);
            const pairData = yield ctx.fetcher.getPair(pair.key, true);
            if (!pairData) {
                throw new Error(`Pair of ${base}/${quote} not found`);
            }
            const oracleCTX = OracleSDK.Context.withProvider(ctx.provider, controllerData.oracleProgramId);
            const productClient = yield OracleSDK.ProductClient.getProduct(oracleCTX, pairData.lockToken, pairData.mintToken);
            return new PairClient(ctx, pair.key, pairData, controllerData, pda, productClient);
        });
    }
    lockNMint(user, lockAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (lockAmount.isNeg() || lockAmount.isZero()) {
                throw new Error(`lockAmount ${lockAmount} is invalid`);
            }
            const { lockTokenVault, mintToken, lockToken } = this.pairData;
            const mintTokenUser = yield deriveATA(user, mintToken);
            const lockTokenUser = yield deriveATA(user, lockToken);
            const userProfile = this.pda.userProfile(user, this.pairKey);
            let lockProfileIndex = 0;
            try {
                const userProfileInfo = yield this.ctx.program.account.userProfile.fetch(userProfile.key);
                lockProfileIndex = userProfileInfo.lockProfileIndex;
            }
            catch (error) {
                // first time
            }
            const lockProfile = this.pda.lockProfile(user, this.pairKey, lockProfileIndex);
            const oraclePrice = this.productClient.productData.priceAccount;
            const tx = (yield this.ctx.methods.lockNMint({
                accounts: {
                    user,
                    pair: this.pairKey,
                    lockTokenVault,
                    mintToken,
                    lockToken,
                    mintTokenUser,
                    lockTokenUser,
                    userProfile: userProfile.key,
                    lockProfile: lockProfile.key,
                    oracleProduct: this.productClient.productKey,
                    oraclePrice,
                },
                inputs: {
                    lockAmount,
                    userProfileBump: userProfile.bump,
                    lockProfileBump: lockProfile.bump,
                },
            })).toTx();
            return tx;
        });
    }
    getUserProfile(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProfile = this.pda.userProfile(user, this.pairKey);
            const userProfileData = yield this.ctx.fetcher.getUserProfile(userProfile.key, true);
            if (!userProfileData) {
                throw new Error(`${user.toBase58()} don't has user profile`);
            }
            const lockProfileData = yield this.ctx.fetcher.getLockProfile(userProfileData.latestLockProfile);
            if (!lockProfileData) {
                throw new Error(`${user.toBase58()} don't has lock profile`);
            }
            return {
                profileKey: userProfile.key,
                userProfile: userProfileData,
                latestLock: lockProfileData,
            };
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const pairData = yield this.ctx.fetcher.getPair(this.pairKey, true);
            if (!pairData) {
                throw new Error(`Pair of ${this.pairData.lockToken}/${this.pairData.mintToken} not found`);
            }
            this.pairData = pairData;
            return this;
        });
    }
}
exports.PairClient = PairClient;
function deriveATA(ownerAddress, tokenMint) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, tokenMint, ownerAddress);
    });
}
exports.deriveATA = deriveATA;
