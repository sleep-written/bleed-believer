import { URL } from 'url';

import { Tsconfig, TsconfigOpts } from './tsconfig/index.js';
import { leftReplacer } from './tool/left-replacer.js';
import { resolve } from 'path';
import { BB_PATH_ALIAS } from './index.js';

export const pathAlias = new class {
    // #isTsNode: boolean;
    #opts: TsconfigOpts;
    get opts(): TsconfigOpts {
        return this.#opts;
    }

    #isTsNode: boolean;
    get isTsNode(): boolean {
        return this.#isTsNode;
    }

    constructor() {
        // Mark this process that this library is in use
        (process as any)[BB_PATH_ALIAS] = true;

        // Get options
        const tsconfig = new Tsconfig();
        this.#opts = tsconfig.getOptions();

        // Check if the path is on source
        this.#isTsNode = process
            .argv[1]
            .startsWith(resolve(this.#opts.rootDir));

        console.log('------------------------------------------');
        console.log('@bleed-believer/path-alias');
        console.log(`> ts-node: ${this.#isTsNode};`);

        if (this.#isTsNode) {
            console.log('  Preparing to execute source files...');
        } else {
            console.log('  Preparing to execute transpiled files...');
        }

        console.log('------------------------------------------');
    }

    replaceLoader(input: string, parentUrl?: string): string {
        // ParentURL is required
        if (typeof parentUrl !== 'string') {
            return input;
        }

        // Check if inside of...
        const path = new URL(parentUrl).pathname;
        const base = this.#isTsNode
            ?   resolve(this.#opts.baseUrl)
            :   leftReplacer(
                    resolve(this.#opts.baseUrl),
                    resolve(this.#opts.rootDir),
                    resolve(this.#opts.outDir)
                );

        if (path.startsWith(base)) {
            const found = Object
                .entries(this.#opts.paths)
                .map(([k, v]) => ({
                    alias: k.replace(/(\\|\/)\*/gi, ''),
                    path: v[0]?.replace(/(\\|\/)\*/gi, '')
                }))
                .find(({ alias }) => input.startsWith(alias));

            if (found) {
                const fullPath = resolve(base, found.path);
                const result = leftReplacer(input, found.alias, fullPath);
                return result;
            }
        }
        
        return input;
    }
}
