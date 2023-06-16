/// <reference types="bn.js" />
import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { TransactionBuilder } from "@orca-so/common-sdk";
import * as OracleSDK from "@renec-foundation/oracle-sdk";
import { Context, PDA } from "..";
import { PairData, UserProfileData, LockProfileData, ControllerData } from "../types";
export declare class PairClient {
    ctx: Context;
    pairData: PairData;
    controllerData: ControllerData;
    pairKey: PublicKey;
    pda: PDA;
    productClient: OracleSDK.ProductClient;
    constructor(ctx: Context, pairKey: PublicKey, pairData: PairData, controllerData: ControllerData, pda: PDA, productClient: OracleSDK.ProductClient);
    static getPair(ctx: Context, quote: PublicKey, base: PublicKey, version?: number): Promise<PairClient>;
    lockNMint(user: PublicKey, lockAmount: BN): Promise<TransactionBuilder>;
    getUserProfile(user: PublicKey): Promise<{
        profileKey: PublicKey;
        userProfile: UserProfileData;
        latestLock: LockProfileData;
    }>;
    refresh(): Promise<PairClient>;
}
export declare function deriveATA(ownerAddress: PublicKey, tokenMint: PublicKey): Promise<PublicKey>;
