import { dirname, resolve } from 'path';

import type { TsconfigMain, TsconfigOpts } from './interfaces/index.js';
import { ConfigNotFoundError } from './errors/index.js';
import { Json } from './json.js';

export class TsconfigV2 {
    #keys = ['baseUrl', 'rootDir', 'outDir', 'paths'];
    #json: {
        new(path: string): {
            loadSync(): TsconfigMain;
        }
    };

    #path: string;
    get path(): string {
        return this.#path;
    }

    constructor(
        path: string,
        json?: {
            new(path: string): {
                loadSync(): TsconfigMain;
            }
        }
    ) {
        this.#path = resolve(path);
        this.#json = json ?? Json
    }

    #getCompilerOptions(
        path: string,
        partialOptions: Partial<TsconfigOpts>
    ): Partial<TsconfigOpts> {
        const json = new this.#json(path).loadSync();
        const pending = this.#keys
            .filter(k => !Object.keys(partialOptions).some(kk => k === kk))
            .filter(k => {
                const value = (json?.compilerOptions as any)?.[k];
                let empty = true;

                switch (k) {
                    case 'paths': {
                        if (typeof value === 'object' && value != null) {
                            partialOptions[k] = value;
                            empty = false;
                        } break;
                    }
                    default: {
                        if (typeof value === 'string') {
                            (partialOptions as any)[k] = resolve(dirname(path), value);
                            empty = false;
                        } break;
                    }
                }

                return empty;
            });

        if (pending.length > 0) {
            if (typeof json.extends === 'string') {
                const newPath = resolve(path, '..', json.extends);
                return this.#getCompilerOptions(newPath, partialOptions);

            } else if (json.extends instanceof Array) {
                for (const extendPath of json.extends) {
                    const newPath = resolve(path, '..', extendPath);
                    partialOptions = this.#getCompilerOptions(newPath, partialOptions);
                }

            }
        }

        return partialOptions;
    }

    getOptions(): TsconfigOpts {
        try {
            const opts = this.#getCompilerOptions(this.#path, {});
            if (!opts.paths) { opts.paths = {}; }

            if (typeof opts.rootDir === 'string') {
                opts.rootDir =  resolve(opts.rootDir);
                opts.baseUrl =  opts.baseUrl ? resolve(opts.baseUrl) : opts.rootDir;
                opts.outDir =   opts.outDir  ? resolve(opts.outDir)  : opts.rootDir;
            } else {
                opts.rootDir =  dirname(this.#path);
                opts.baseUrl =  opts.baseUrl ? resolve(opts.baseUrl) : dirname(this.#path);
                opts.outDir =   opts.outDir  ? resolve(opts.outDir)  : dirname(this.#path);
            }

            return opts as any;
        } catch (err) {
            throw new ConfigNotFoundError();
        }
    }
}
