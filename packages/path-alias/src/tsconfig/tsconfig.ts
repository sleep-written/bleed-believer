import { resolve } from 'path';

import { ConfigNotFoundError } from './errors/index.js';
import { getCompilerOptions } from './get-compiler-options.js';
import { TsconfigOpts } from './interfaces/index.js';

export class Tsconfig {
    #path: string;
    get path(): string {
        return this.#path;
    }

    constructor(path?: string) {
        this.#path = path ?? './tsconfig.json';
    }

    getOptions(): TsconfigOpts {
        try {
            const opts = getCompilerOptions(this.#path, {});
            opts.baseUrl = resolve(opts.baseUrl);
            opts.rootDir = resolve(opts.rootDir);
            opts.outDir = resolve(opts.outDir);
            return opts;
        } catch (err) {
            throw new ConfigNotFoundError();
        }
    }
}
