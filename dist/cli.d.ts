#! /usr/bin/env node
import { PublicKey } from "@solana/web3.js";
export declare function deriveATA(ownerAddress: PublicKey, tokenMint: PublicKey): Promise<PublicKey>;
