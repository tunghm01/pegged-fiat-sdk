import { BN, AccountsCoder, Idl } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { PeggedFiat } from "../artifacts/pegged_fiat";
import IDL from "../artifacts/pegged_fiat.json";

export type PeggedFiatType = PeggedFiat;
export const PeggedFiatIDL = IDL as Idl;
export const accountsCoder = new AccountsCoder(PeggedFiatIDL);

export enum AccountName {
  Controller = "Controller",
  Pair = "Pair",
  UserProfile = "UserProfile",
  LockProfile = "LockProfile",
}

export const AccountState = {
  Unknown: { unknown: {} },
  Active: { active: {} },
  Inactive: { inactive: {} },
};

export type ControllerData = {
  version: number;
  authority: PublicKey;
  oracleProgramId: PublicKey;
  bump: number[];
};

export type PairData = {
  version: number;
  controller: PublicKey;
  lockToken: PublicKey;
  lockTokenVault: PublicKey;
  mintToken: PublicKey;
  burnTokenVault: PublicKey;
  totalLocked: BN;
  totalMinted: BN;
  oracleProduct: PublicKey;
  bump: number[];
};

export type PriceProfileData = {
  price: BN;
  expo: number;
  lockAmount: BN;
};

export type LockProfileData = {
  user: PublicKey;
  totalLocked: BN;
  totalMinted: BN;
  prev: PublicKey;
  bump: number[];
  priceHistory: PriceProfileData[];
};

export type UserProfileData = {
  state: object;
  pair: PublicKey;
  user: PublicKey;
  totalLocked: BN;
  totalMinted: BN;
  latestLockProfile: PublicKey;
  lockProfileIndex: number;
  bump: number[];
};
