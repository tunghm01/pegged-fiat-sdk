import { Instruction } from "@orca-so/common-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
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

export async function addPair(
  program: Program<PeggedFiat>,
  params: AddPairParams
): Promise<Instruction> {
  const { accounts, inputs } = params;

  const ix = await program.instruction.addPair(params.inputs.version, params.inputs.pairBump, {
    accounts: {
      ...accounts,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    },
  });

  return {
    instructions: [ix],
    cleanupInstructions: [],
    signers: [],
  };
}
