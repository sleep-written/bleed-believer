import type { TsconfigOpts } from './tsconfig/index.js';

import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

import { leftReplacer } from './tool/left-replacer.js';
import { Tsconfig } from './tsconfig/index.js';

/**
 * A custom symbol to mark if ts-node is already used
 */
export const BB_TS_NODE = Symbol.for('@bleed-believer/ts-node');
/**
 * A symbol used to mark in "process" object that this library is used
 * in runtime.
 */
export const BB_PATH_ALIAS = Symbol.for('@bleed-believer/path-alias');

// Parses the *.env file
config();

/**
 * A constant to manage the current library status.
 */
export const pathAlias = new class {
    #opts: TsconfigOpts;
    get opts(): TsconfigOpts {
        return this.#opts;
    }

    #isTsNode: boolean;
    get isTsNode(): boolean {
        return this.#isTsNode;
    }

    get verbose(): boolean {
        const verbose = process.env['BB_PATH_ALIAS_VERBOSE'];
        return verbose?.toLowerCase() === 'true';
    }

    constructor() {
        // Mark this process that this library is in use
        (process as any)[BB_PATH_ALIAS] = true;

        // Get options
        const tsconfig = new Tsconfig();
        this.#opts = tsconfig.getOptions();

        // Check if the path is on source
        this.#isTsNode =  false;
    }

    showInConsole(legacy?: boolean): void {
        if (this.verbose) {
            console.log('------------------------------------');
            console.log('@bleed-believer/path-alias');
            console.log(`> type   : ${legacy ? 'CommmonJS' : 'ESM'};`);
            console.log('  Preparing to execute...');
            console.log('------------------------------------');
        }
    }

    checkTsNode(url: string): boolean;
    checkTsNode(specifier: string, context: { parentURL?: string }): boolean;
    checkTsNode(...args: [ string, { parentURL?: string }? ]): boolean {
        const found = Object
            .getOwnPropertySymbols(process)
            .some(x => x === BB_TS_NODE);
        
        try {
            if (found) {
                this.#isTsNode = true;
            } else if (args.length === 1) {
                const path = fileURLToPath(args[0]);
                this.#isTsNode = path.startsWith(this.#opts.rootDir);
            } else if (typeof args[1]?.parentURL !== 'string') {
                const path = fileURLToPath(args[0]);
                this.#isTsNode = path.startsWith(this.#opts.rootDir);
            } else {
                const path = fileURLToPath(args[1].parentURL);
                this.#isTsNode = path.startsWith(this.#opts.rootDir);
            }
        } catch {
            this.#isTsNode = false;
        }

        if (this.#isTsNode && !found) {
            if (this.verbose) {
                console.log('------------------------------------');
                console.log('> Source file found!');
                console.log('  Using "ts-node"...');
                console.log('------------------------------------');
            }

            (process as any)[BB_TS_NODE] = true;
        }

        return this.#isTsNode;
    }

    replaceLoader(specifier: string, context: { parentURL?: string }): string {
        // ParentURL is required
        if (typeof context.parentURL !== 'string') {
            return specifier;
        }

        // Check if inside of...
        const path = fileURLToPath(context.parentURL);
        const root = resolve(this.#opts.rootDir);

        if (path.startsWith(root)) {
            const found = Object
                .entries(this.#opts.paths)
                .map(([alias, path]) => ({
                    alias: alias.replace(/\*$/gi, ''),
                    path: path.map(p => p.replace(/\*$/gi, ''))
                }))
                .find(({alias}) => specifier.startsWith(alias));

            if (found && found.path[0]) {
                const fullPath = leftReplacer(
                    join(this.#opts.baseUrl, found.path[0]),
                    this.#opts.baseUrl,
                    this.checkTsNode(specifier, context)
                        ?   this.#opts.rootDir
                        :   this.#opts.outDir
                );

                
                const result = specifier !== found.alias
                    ?   join(fullPath, leftReplacer(specifier, found.alias, ''))
                    :   fullPath;

                console.log('specifier:', specifier);

                if (pathAlias.isTsNode) {
                    return result
                        .replace(/\.js$/gi, '.ts')
                        .replace(/\.mjs$/gi, '.mts');
                } else {
                    return result
                        .replace(/\.ts$/gi, '.js')
                        .replace(/\.mts$/gi, '.mjs');
                }
            }
        }
        
        return specifier;
    }
}
