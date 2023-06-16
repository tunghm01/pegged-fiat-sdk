import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as OracleSDK from "@renec-foundation/oracle-sdk";
import { Context, PDA } from "..";
import { PairData, UserProfileData, LockProfileData, ControllerData } from "../types";

export class PairClient {
  ctx: Context;
  public pairData: PairData;
  public controllerData: ControllerData;
  public pairKey: PublicKey;
  public pda: PDA;
  public productClient: OracleSDK.ProductClient;

  constructor(
    ctx: Context,
    pairKey: PublicKey,
    pairData: PairData,
    controllerData: ControllerData,
    pda: PDA,
    productClient: OracleSDK.ProductClient
  ) {
    this.ctx = ctx;
    this.pairData = pairData;
    this.pairKey = pairKey;
    this.pda = pda;
    this.productClient = productClient;
    this.controllerData = controllerData;
  }

  public static async getPair(
    ctx: Context,
    quote: PublicKey,
    base: PublicKey,
    version = 1
  ): Promise<PairClient> {
    const pda = new PDA(ctx.program.programId);

    const controller = pda.controller(version);
    const controllerData = await ctx.fetcher.getController(controller.key);
    if (!controllerData) {
      throw new Error(`Controller of ${version} not found`);
    }

    const pair = pda.pair(quote, base, version);
    const pairData = await ctx.fetcher.getPair(pair.key, true);
    if (!pairData) {
      throw new Error(`Pair of ${base}/${quote} not found`);
    }

    const oracleCTX = OracleSDK.Context.withProvider(ctx.provider, controllerData.oracleProgramId);
    const productClient = await OracleSDK.ProductClient.getProduct(
      oracleCTX,
      pairData.lockToken,
      pairData.mintToken
    );

    return new PairClient(ctx, pair.key, pairData, controllerData, pda, productClient);
  }

  public async lockNMint(user: PublicKey, lockAmount: BN): Promise<TransactionBuilder> {
    if (lockAmount.isNeg() || lockAmount.isZero()) {
      throw new Error(`lockAmount ${lockAmount} is invalid`);
    }

    const { lockTokenVault, mintToken, lockToken } = this.pairData;

    const mintTokenUser = await deriveATA(user, mintToken);
    const lockTokenUser = await deriveATA(user, lockToken);

    const userProfile = this.pda.userProfile(user, this.pairKey);
    let lockProfileIndex = 0;
    try {
      const userProfileInfo = await this.ctx.program.account.userProfile.fetch(userProfile.key);
      lockProfileIndex = userProfileInfo.lockProfileIndex;
    } catch (error) {
      // first time
    }
    const lockProfile = this.pda.lockProfile(user, this.pairKey, lockProfileIndex);

    const oraclePrice = this.productClient.productData.priceAccount;
    const tx = (
      await this.ctx.methods.lockNMint({
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
      })
    ).toTx();

    return tx;
  }

  public async getUserProfile(
    user: PublicKey
  ): Promise<{ profileKey: PublicKey; userProfile: UserProfileData; latestLock: LockProfileData }> {
    const userProfile = this.pda.userProfile(user, this.pairKey);

    const userProfileData = await this.ctx.fetcher.getUserProfile(userProfile.key, true);
    if (!userProfileData) {
      throw new Error(`${user.toBase58()} don't has user profile`);
    }

    const lockProfileData = await this.ctx.fetcher.getLockProfile(
      userProfileData.latestLockProfile
    );
    if (!lockProfileData) {
      throw new Error(`${user.toBase58()} don't has lock profile`);
    }

    return {
      profileKey: userProfile.key,
      userProfile: userProfileData,
      latestLock: lockProfileData,
    };
  }

  public async refresh(): Promise<PairClient> {
    const pairData = await this.ctx.fetcher.getPair(this.pairKey, true);
    if (!pairData) {
      throw new Error(`Pair of ${this.pairData.lockToken}/${this.pairData.mintToken} not found`);
    }

    this.pairData = pairData;
    return this;
  }
}

export async function deriveATA(ownerAddress: PublicKey, tokenMint: PublicKey): Promise<PublicKey> {
  return await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    tokenMint,
    ownerAddress
  );
}
