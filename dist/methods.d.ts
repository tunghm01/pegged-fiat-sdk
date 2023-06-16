import { TransactionBuilder, Instruction } from "@orca-so/common-sdk";
import { Context } from "./context";
import * as ixs from "./instructions";
export declare class Methods {
    ctx: Context;
    ix: Instruction | null | undefined;
    constructor(ctx: Context, ix?: Instruction);
    addPair(params: ixs.AddPairParams): Promise<this>;
    lockNMint(params: ixs.LockNMintParams): Promise<this>;
    toTx(): TransactionBuilder;
}
