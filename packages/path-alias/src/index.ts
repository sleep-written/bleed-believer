/**
 * A symbol used to mark in "process" object that this library is used
 * in runtime.
 */
export const BB_PATH_ALIAS = Symbol('@bleed-believer/path-alias');

/**
 * Checks if this library is already used in runtime.
 */
export function isPathAliasRunning(): boolean {
    return Object
        .getOwnPropertySymbols(process)
        .some(s => s === BB_PATH_ALIAS);
}
