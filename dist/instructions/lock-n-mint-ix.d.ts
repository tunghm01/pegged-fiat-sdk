/// <reference types="bn.js" />
import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program, BN } from "@project-serum/anchor";
import { PeggedFiat } from "../artifacts/pegged_fiat";
export type LockNMintParams = {
    accounts: {
        user: PublicKey;
        pair: PublicKey;
        lockTokenVault: PublicKey;
        mintToken: PublicKey;
        lockToken: PublicKey;
        mintTokenUser: PublicKey;
        lockTokenUser: PublicKey;
        userProfile: PublicKey;
        lockProfile: PublicKey;
        oraclePrice: PublicKey;
        oracleProduct: PublicKey;
    };
    inputs: {
        lockAmount: BN;
        userProfileBump: number;
        lockProfileBump: number;
    };
};
export declare function lockNMint(program: Program<PeggedFiat>, params: LockNMintParams): Promise<Instruction>;
