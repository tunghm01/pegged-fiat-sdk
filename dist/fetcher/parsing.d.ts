/// <reference types="node" />
import { ControllerData, PairData, UserProfileData, LockProfileData } from "../types";
/**
 * Static abstract class definition to parse entities.
 * @category Parsables
 */
export interface ParsableEntity<T> {
    /**
     * Parse account data
     *
     * @param accountData Buffer data for the entity
     * @returns Parsed entity
     */
    parse: (accountData: Buffer | undefined | null) => T | null;
}
export declare class ParsablePair {
    private constructor();
    static parse(data: Buffer | undefined | null): PairData | null;
}
export declare class ParsableUserProfile {
    private constructor();
    static parse(data: Buffer | undefined | null): UserProfileData | null;
}
export declare class ParsableLockProfile {
    private constructor();
    static parse(data: Buffer | undefined | null): LockProfileData | null;
}
export declare class ParsableController {
    private constructor();
    static parse(data: Buffer | undefined | null): ControllerData | null;
}
