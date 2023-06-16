import { TransactionBuilder, Instruction } from "@orca-so/common-sdk";
import { Context } from "./context";
import * as ixs from "./instructions";

export class Methods {
  public ctx: Context;
  public ix: Instruction | null | undefined;

  public constructor(ctx: Context, ix?: Instruction) {
    this.ctx = ctx;
    this.ix = ix;
  }

  public async addPair(params: ixs.AddPairParams) {
    this.ix = await ixs.addPair(this.ctx.program, params);
    return this;
  }

  public async lockNMint(params: ixs.LockNMintParams) {
    this.ix = await ixs.lockNMint(this.ctx.program, params);
    return this;
  }

  public toTx(): TransactionBuilder {
    const tx = new TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet);
    return this.ix ? tx.addInstruction(this.ix) : tx;
  }
}
