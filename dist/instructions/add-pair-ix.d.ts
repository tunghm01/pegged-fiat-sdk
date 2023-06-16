import { Instruction } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { PeggedFiat } from "../artifacts/pegged_fiat";
export type AddPairParams = {
    accounts: {
        authority: PublicKey;
        controller: PublicKey;
        pair: PublicKey;
        lockToken: PublicKey;
        mintToken: PublicKey;
        lockTokenVault: PublicKey;
        burnTokenVault: PublicKey;
        oracleProduct: PublicKey;
    };
    inputs: {
        version: number;
        pairBump: number;
    };
};
export declare function addPair(program: Program<PeggedFiat>, params: AddPairParams): Promise<Instruction>;
