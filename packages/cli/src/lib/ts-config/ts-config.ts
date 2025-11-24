import type { TsConfigValue, TSConfigLoadInject, TSConfigInject, DirentObject } from './interfaces/index.js';
import type { Config } from '@swc/core';

import { basename, dirname, join, resolve, sep } from 'path';
import { tsConfigToSWC } from './ts-config.to-swc.js';
import { tsConfigLoad } from './ts-config.load.js';
import { glob } from 'fs/promises';

export class TSConfig {
    static async load(target?: string | null, inject?: TSConfigLoadInject): Promise<TSConfig> {
        const value = await tsConfigLoad(target, inject);
        return new TSConfig(value, {
            process: inject?.process
        });
    }
    #rootDir: string;
    #outDir: string;
    #inject: Required<TSConfigInject>;

    #value: TsConfigValue;
    get value(): TsConfigValue {
        return structuredClone(this.#value);
    }

    constructor(value: TsConfigValue, inject?: TSConfigInject) {
        this.#value = value;
        this.#inject = {
            process:    inject?.process ?? process,
            glob:       inject?.glob?.bind(inject) ?? glob
        };

        const cwd = this.#inject.process.cwd();
        this.#outDir = resolve(cwd, value?.compilerOptions?.outDir ?? '.');
        this.#rootDir = resolve(cwd, value?.compilerOptions?.rootDir ?? '.');
    }

    async *getSourceCode(): AsyncGenerator<DirentObject> {
        const options: Parameters<Required<TSConfigInject>['glob']>[1] = {
            cwd: this.#inject.process.cwd(),
            withFileTypes: true
        };

        if (this.#value.exclude instanceof Array) {
            options.exclude = this.#value.exclude;
        }

        const pattern = join(this.#rootDir, './**/*.{ts,mts,cts,tsx,mtsx,ctsx}');
        for await (const dirent of this.#inject.glob(pattern, options)) {
            yield dirent;
        }
    }

    getOutputPath(input: string | DirentObject): string {
        if (typeof input !== 'string') {
            input = resolve(input.parentPath, input.name);
        }

        if (!input.startsWith(this.#rootDir + sep)) {
            return input;
        }

        const source = resolve(
            this.#outDir,
            input.slice(this.#rootDir.length + 1)
        );

        return source.replace(/(?<=\.(m|c)?)t(?=sx?$)/i, 'j');
    }

    toSWC(): Config {
        return tsConfigToSWC(this.#value, this.#inject);
    }
}