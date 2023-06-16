#! /usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveATA = void 0;
require("dotenv").config();
const commander_1 = require("commander");
const anchor = __importStar(require("@coral-xyz/anchor"));
const anchor_1 = require("@coral-xyz/anchor");
const pegged_fiat_json_1 = __importDefault(require("./artifacts/pegged_fiat.json"));
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const figlet = require("figlet");
//add the following line
// const program = new Command();
console.log(figlet.textSync("Pegged Fiat"));
console.log("");
// program
//   .version("1.0.0")
//   .command("initialize")
//   .description("An example CLI for managing a directory")
//   .requiredOption("-c, --cheese <type>", "pizza must have cheese")
//   .action((params) => {
//     console.log(params);
//   });
// .argument("<string>", "must be have")
// .arguments("'[string1]', 'string to split 1")
// .requiredOption("-i, --init  <value1> <value2>", "List directory contents")
// .option("-m, --mkdir <value>", "Create a directory")
// .option("-t, --touch <value>", "Create a file")
// program.parse();
// const options = program.opts();
const program = new commander_1.Command();
const PEGGED_FIAT = "pegged_fiat_v1";
const mint = anchor.web3.Keypair.generate();
let owner;
program
    .command("initialize")
    .description("initialize a new token-name with decimals, and mint amount tokens to owner.")
    .requiredOption("-n, --token-name <string>", "name of the fiat token")
    .requiredOption("-d, --decimals <number>", "decimals of the fiat token")
    .requiredOption("-a, --amount <number>", "amount token will be minted")
    .option("--rpc <string>", "RPC of network. Default: https://api-mainnet-beta.renec.foundation:8899/", "https://api-mainnet-beta.renec.foundation:8899/")
    .action(({ decimals, tokenName, amount, rpc }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log();
    if (!tokenName || tokenName === "") {
        console.log("Error: -n or --token-name is required");
        return;
    }
    if (!amount || amount === "0" || isNaN(amount)) {
        console.log("Error: -a or --amount is a number and required");
        return;
    }
    if (!decimals || decimals === "") {
        console.log("Error: -d or --decimals is a number[0 - 9] and required");
        return;
    }
    if (!process.env.PROGRAM_ID) {
        console.log("PROGRAM_ID is not found in .env file");
        return;
    }
    try {
        const ownerWallet = require("../.wallets/owner.json");
        owner = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(ownerWallet));
    }
    catch (_a) {
        throw new Error("owner keypair in is required");
    }
    const connection = new web3_js_1.Connection(rpc);
    const wallet = new anchor.Wallet(owner);
    const anchorProvider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
    const programId = new web3_js_1.PublicKey(process.env.PROGRAM_ID);
    const peggedProgram = new anchor_1.Program(pegged_fiat_json_1.default, programId, anchorProvider);
    if (!peggedProgram.provider.publicKey) {
        console.log("Error: Please provide owner key. `export OWNER_KEY=`");
        return;
    }
    const [controllerPDA, bump] = anchor.web3.PublicKey.findProgramAddressSync([anchor.utils.bytes.utf8.encode(PEGGED_FIAT), mint.publicKey.toBuffer()], peggedProgram.programId);
    console.log(`RPC: ${rpc}`);
    console.log(`Owner: ${owner.publicKey.toBase58()}`);
    console.log(`Program Id: ${programId.toBase58()}`);
    console.log();
    // console.log(`Initializing token-name=${tokenName} decimals=${decimals}`);
    let tx = yield peggedProgram.methods
        .initializeV1(bump, decimals, tokenName, tokenName)
        .accounts({
        owner: peggedProgram.provider.publicKey,
        controller: controllerPDA,
        tokenMint: mint.publicKey,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        systemProgram: web3_js_1.SystemProgram.programId,
        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
    })
        .transaction();
    if (!peggedProgram.provider.sendAndConfirm) {
        throw new Error("sendAndConfirm must be a function");
    }
    const signature1 = yield peggedProgram.provider.sendAndConfirm(tx, [mint]);
    console.log(`${tokenName} mint: ${mint.publicKey.toBase58()}`);
    console.log(`${tokenName} decimals: ${decimals}`);
    console.log(`${tokenName} authority: ${controllerPDA.toBase58()}`);
    console.log(`https://explorer.renec.foundation/tx/${signature1}`);
    console.log("");
    const mintAmount = new anchor.BN(amount);
    const recipientATA = yield deriveATA(peggedProgram.provider.publicKey, mint.publicKey);
    tx = yield peggedProgram.methods
        .mintToV1(mintAmount)
        .accounts({
        mintAuthority: peggedProgram.provider.publicKey,
        controller: controllerPDA,
        tokenMint: mint.publicKey,
        recipientTokenAccount: recipientATA,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        systemProgram: web3_js_1.SystemProgram.programId,
        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
    })
        .transaction();
    const signature2 = yield peggedProgram.provider.sendAndConfirm(tx);
    console.log(`Mint ${amount} ${tokenName} to Owner Token Account (${recipientATA.toBase58()})`);
    console.log(`https://explorer.renec.foundation/tx/${signature2}`);
    console.log();
}));
function deriveATA(ownerAddress, tokenMint) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, tokenMint, ownerAddress);
    });
}
exports.deriveATA = deriveATA;
// program
//   .command("mint")
//   .description("mint `amount` `mint` tokens to owner.")
//   .option("-m, --mint <string>", "mint token will be minted", "")
//   .option("-a, --amount <number>", "amount token will be minted", "0")
//   .option(
//     "--rpc <string>",
//     "RPC of network. Default: https://api-mainnet-beta.renec.foundation:8899/",
//     "https://api-mainnet-beta.renec.foundation:8899/"
//   )
//   .action(async ({ amount, rpc, mint }) => {
//     console.log();
//     if (!mint || mint === "") {
//       console.log("Error: -m or --mint is required");
//       return;
//     }
//     const mintPub = new PublicKey(mint);
//     if (!amount || amount === "0" || isNaN(amount)) {
//       console.log("Error: -a or --amount is a number and required");
//       return;
//     }
//     if (!process.env.PROGRAM_ID) {
//       console.log("PROGRAM_ID is not found in .env file");
//       return;
//     }
//     const connection = new Connection(rpc);
//     try {
//       const ownerWallet = require("../.wallets/owner.json");
//       owner = Keypair.fromSecretKey(Uint8Array.from(ownerWallet));
//     } catch {
//       throw new Error("owner keypair in is required");
//     }
//     const wallet = new anchor.Wallet(owner);
//     const anchorProvider = new anchor.AnchorProvider(
//       connection,
//       wallet,
//       anchor.AnchorProvider.defaultOptions()
//     );
//     const programId = new PublicKey(process.env.PROGRAM_ID);
//     const peggedProgram = new Program(PeggedFiat as Idl, programId, anchorProvider);
//     if (!peggedProgram.provider.publicKey) {
//       console.log("Error: Please provide owner key. `export OWNER_KEY=`");
//       return;
//     }
//     console.log(`RPC: ${rpc}`);
//     console.log(`Owner: ${owner.publicKey.toBase58()}`);
//     console.log(`Program Id: ${programId.toBase58()}`);
//     console.log();
//     const [controllerPDA, bump] = anchor.web3.PublicKey.findProgramAddressSync(
//       [anchor.utils.bytes.utf8.encode(PEGGED_FIAT), mintPub.toBuffer()],
//       peggedProgram.programId
//     );
//     const mintAmount = new anchor.BN(amount);
//     const recipientATA = await deriveATA(peggedProgram.provider.publicKey, mintPub);
//     if (!peggedProgram.provider.sendAndConfirm) {
//       throw new Error("sendAndConfirm must be a function");
//     }
//     let tx = await peggedProgram.methods
//       .mintToV1(mintAmount)
//       .accounts({
//         mintAuthority: peggedProgram.provider.publicKey,
//         controller: controllerPDA,
//         tokenMint: mintPub,
//         recipientTokenAccount: recipientATA,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         rent: SYSVAR_RENT_PUBKEY,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//       })
//       .transaction();
//     const signature2 = await peggedProgram.provider.sendAndConfirm(tx);
//     console.log(
//       `Mint ${amount} ${mintPub.toBase58()} to Owner Token Account (${recipientATA.toBase58()})`
//     );
//     console.log(`https://explorer.renec.foundation/tx/${signature2}`);
//     console.log();
//   });
program.parse();
