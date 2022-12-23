import { fileURLToPath, pathToFileURL } from 'url';
import { resolve, extname, join } from 'path';
import { leftReplacer } from '../../tool/left-replacer.js';

import { Tsconfig } from '../../tsconfig/tsconfig.js';

export class Resolver {
    static #tsconfig = new Tsconfig().getOptions();
    static #isTsNode = false;
    static isTsNode(): boolean {
        return Resolver.#isTsNode;
    }

    static load(url: string): { url: string; isTsNode: boolean; } {
        // Set value for ts-node
        if (!Resolver.#isTsNode) {
            const path = new URL(url).pathname;
            const ext = extname(path).toLowerCase();
            switch (ext) {
                case '.ts':
                case '.mts':
                    Resolver.#isTsNode = true;
                    break;
            }
        }

        // Check extension
        const baseUrl = resolve(Resolver.#tsconfig.baseUrl);
        const base = !Resolver.#isTsNode
            ?   leftReplacer(baseUrl, resolve(Resolver.#tsconfig.rootDir), resolve(Resolver.#tsconfig.outDir))
            :   baseUrl;

        const path = fileURLToPath(url);
        if (path.startsWith(base) && Resolver.#isTsNode) {
            let key = url.at(-2);
            switch (key) {
                case 'J':
                    key = 'T';
                    break;
                case 'j':
                    key = 't';
                    break;
            }

            url = url.slice(0, -2) + key + url.slice(-1);
        }

        return { url, isTsNode: Resolver.#isTsNode };
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

    isTsNode(): boolean {
        return Resolver.#isTsNode;
    }

    resolve(): { specifier: string; isTsNode: boolean; } {
        const isTsNode = Resolver.#isTsNode;
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
                        if (!Resolver.#isTsNode) {
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
                    if (!Resolver.#isTsNode) {
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