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
        return getCompilerOptions(this.#path, {});
    }
}
