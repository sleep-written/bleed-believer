import { fileURLToPath, pathToFileURL } from 'url';
import { resolve, extname, join } from 'path';
import { leftReplacer } from '../tool/left-replacer.js';

import { PathAlias } from '../path-alias.js';
import { Tsconfig } from '../tsconfig/tsconfig.js';

export class Resolver {
    static #tsconfig = new Tsconfig().getOptions();

    static #setExt(input: string, to: 't' | 'j'): string {
        let key = input.at(-2);
        const from = to === 'j' ? 't' : 'j';
        switch (key) {
            case from.toUpperCase():
                key = from === 't' ? 'J' : 'T';
                break;
            case from:
                key = from === 't' ? 'j' : 't';
                break;
        }

        return input.slice(0, -2) + key + input.slice(-1);
    }

    static load(url: string): { url: string; isTsNode: boolean; } {
        // Prepare library
        const alias = new PathAlias();
        alias.initialize();

        // Not modify node libraries
        let isTsNode = alias.isTsNode();
        if (url.startsWith('node:')) {
            return { url, isTsNode };
        }

        // Set value for ts-node
        if (!isTsNode) {
            const path = new URL(url).pathname;
            const ext = extname(path).toLowerCase();
            switch (ext) {
                case '.ts':
                case '.mts':
                    alias.markWithTsNode();
                    isTsNode = true;
                    break;
            }
        }

        // Check extension
        const baseUrl = resolve(Resolver.#tsconfig.baseUrl);
        const base = !isTsNode
            ?   leftReplacer(baseUrl, resolve(Resolver.#tsconfig.rootDir), resolve(Resolver.#tsconfig.outDir))
            :   baseUrl;

        const path = fileURLToPath(url);
        if (path.startsWith(base) && isTsNode) {
            url = this.#setExt(url, 't');
        }

        // Return response
        return { url, isTsNode };
    }

    #specifierUrl?: URL;
    #specifier: string;

    constructor(specifier: string) {
        this.#specifier = specifier;

        try {
            this.#specifierUrl = new URL(specifier);
        } catch {
            this.#specifierUrl = undefined;
        }
    }

    resolve(): { specifier: string; isTsNode: boolean; } {
        const isTsNode = new PathAlias().isTsNode();
        let specifier = this.#specifier;

        if (!this.#specifierUrl) {
            const rootDir = Resolver.#tsconfig.rootDir;
            const outDir = Resolver.#tsconfig.outDir;

            const baseUrl = Resolver.#tsconfig.baseUrl;
            const paths = Resolver.#tsconfig.paths;

            for (const alias of Object.keys(paths)) {
                if (alias.endsWith('*')) {
                    // It's a prefix
                    const innerPath = paths[alias][0]?.replace(/\*$/gi, '');
                    const prefix = alias.replace(/\*$/gi, '');

                    if (specifier.startsWith(prefix)) {
                        // Prefix found
                        const start = resolve(baseUrl, innerPath);
                        const tail = leftReplacer(this.#specifier, prefix, '');

                        let fullPath = join(start, tail);
                        if (!isTsNode) {
                            fullPath = leftReplacer(
                                fullPath,
                                rootDir,
                                outDir
                            );
                        }

                        specifier = pathToFileURL(fullPath).href;
                        break;
                    }
                } else if (specifier === alias) {
                    // It's a full path
                    let fullPath = resolve(baseUrl, paths[alias][0]);
                    fullPath = Resolver.#setExt(
                        fullPath,
                        isTsNode ? 't' : 'j'
                    )

                    if (!isTsNode) {
                        fullPath = leftReplacer(
                            fullPath,
                            rootDir,
                            outDir
                        );
                    }

                    specifier = pathToFileURL(fullPath).href;
                    break;
                }
            }
        }

        return {
            specifier,
            isTsNode
        };
    }
}