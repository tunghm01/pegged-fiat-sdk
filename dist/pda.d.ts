import * as anchor from "@project-serum/anchor";
export declare const CONTROLLER = "controller";
export declare const PAIR_SEED = "pair";
export declare const USER_PROFILE_SEED = "user_profile";
export declare const LOCK_PROFILE_SEED = "lock_profile";
export interface PDAInfo {
    key: anchor.web3.PublicKey;
    bump: number;
}
export declare class PDA {
    readonly programId: anchor.web3.PublicKey;
    constructor(programId: anchor.web3.PublicKey);
    controller: (version?: number) => PDAInfo;
    pair: (lockToken: anchor.web3.PublicKey, mintToken: anchor.web3.PublicKey, version?: number) => PDAInfo;
    userProfile: (user: anchor.web3.PublicKey, pair: anchor.web3.PublicKey) => PDAInfo;
    lockProfile: (user: anchor.web3.PublicKey, pair: anchor.web3.PublicKey, index: number) => PDAInfo;
}
