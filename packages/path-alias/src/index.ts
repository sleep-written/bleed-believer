import { pathToFileURL } from 'url';
import { join } from 'path';

import { BB_PATH_ALIAS, BB_TS_NODE, pathAlias } from './path-alias.js';
export { ConfigNotFoundError } from './tsconfig/index.js';
import { leftReplacer } from './tool/left-replacer.js';

/**
 * Checks if this library is already used in runtime.
 */
export function isPathAliasRunning(): boolean {
    return Object
        .getOwnPropertySymbols(process)
        .some(s => s === BB_PATH_ALIAS);
}

/**
 * Checks if ts-node is already used in runtime.
 */
export function isTsNodeRunning(): boolean {
    return Object
        .getOwnPropertySymbols(process)
        .some(s => s === BB_TS_NODE);
}

/**
 * Resolves a path inside of "rootDir" (the property in `tsconfig.json`), depending
 * if your code is running through __ts-node_ or directly with node (the "outDir" folder).
 * @param path The path do you want to resolve __inside of your "rootDir" folder.__
 * @param options Set the options of the resolver.
 * @returns 
 */
export function pathResolve(
    path: string,
    options?: {
        /**
         * If `true`, returns the full path, otherwise returns
         * the path relative to the current working directory.
         */
        absolute?: boolean;

        /**
         * If true, converts the extensions `*.ts` / `*.mts` /
         * `*.cts` /  `*.js` / `*.mjs` / `*.cjs` depending
         * if __ts-node__ is running or not.
         */
        ext?: boolean;
    }
): string {
    const execUrl = pathToFileURL(process.argv[1]).href;
    const isTsNode = pathAlias.checkTsNode(execUrl);
    let resp = isTsNode
        ?   join(pathAlias.opts.rootDir, path)
        :   join(pathAlias.opts.outDir,  path);

    if (options?.ext && isTsNode) {
        resp = resp
            .replace(/\.mjs$/gi, '.mts')
            .replace(/\.js$/gi, '.ts');
    } else if (options?.ext) {
        resp = resp
            .replace(/\.mts$/gi, '.mjs')
            .replace(/\.ts$/gi, '.js');
    }
    
    if (options?.absolute) {
        return resp;
    } else {
        return leftReplacer(resp, process.cwd(), '')
            .replace(/^(\\|\/)+/gi, '');
    }
}
