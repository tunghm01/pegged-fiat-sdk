import { Connection } from "@solana/web3.js";
import { Address } from "@project-serum/anchor";
import { ControllerData, PairData, UserProfileData, LockProfileData } from "../";
import { ParsableEntity, ParsablePair, ParsableUserProfile, ParsableLockProfile } from "./parsing";
/**
 * Supported accounts
 */
type CachedValue = ParsablePair | ParsableUserProfile | ParsableLockProfile;
/**
 * Include both the entity (i.e. type) of the stored value, and the value itself
 */
interface CachedContent<T extends CachedValue> {
    entity: ParsableEntity<T>;
    value: CachedValue | null;
}
export declare class AccountFetcher {
    private readonly connection;
    private readonly _cache;
    private _tokenAccountRentExempt;
    constructor(connection: Connection, cache?: Record<string, CachedContent<CachedValue>>);
    /*** Public Methods ***/
    /**
     * Retrieve minimum balance for rent exemption of a Token Account;
     *
     * @param refresh force refresh of account rent exemption
     * @returns minimum balance for rent exemption
     */
    getTokenAccountRentExempt(refresh?: boolean): Promise<number>;
    /**
     * Update the cached value of all entities currently in the cache.
     * Uses batched rpc request for network efficient fetch.
     */
    refreshAll(): Promise<void>;
    /*** Private Methods ***/
    /**
     * Retrieve from cache or fetch from rpc, an account
     */
    private get;
    /**
     * Retrieve from cache or fetch from rpc, a list of accounts
     */
    private list;
    /**
     * Make batch rpc request
     */
    private bulkRequest;
    getController(address: Address, refresh?: boolean): Promise<ControllerData | null>;
    getPair(address: Address, refresh?: boolean): Promise<PairData | null>;
    getUserProfile(address: Address, refresh?: boolean): Promise<UserProfileData | null>;
    getLockProfile(address: Address, refresh?: boolean): Promise<LockProfileData | null>;
}
export {};
