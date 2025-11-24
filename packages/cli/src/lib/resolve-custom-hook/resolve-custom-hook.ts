import type { ResolveFnOutput, ResolveHookContext } from 'module';
import type { ResolveCustomHookInject, DefaultResolve } from './interfaces/index.js';
import type { TSConfig } from '@lib/ts-config/index.js';

import { dirname, resolve, sep } from 'path';
import { fileURLToPath } from 'url';
import { access } from 'fs/promises';

import { replaceFromStart } from './replace-from-start.js';
import { PathAlias } from '@lib/path-alias/index.js';

export class ResolveCustomHook {
    #pathAlias: PathAlias;
    #rootDir: string;
    #outDir: string;
    #inject: Required<ResolveCustomHookInject>;
    #cache = new Map<string, string>();

    constructor(tsConfig: TSConfig, inject?: ResolveCustomHookInject) {
        this.#pathAlias = new PathAlias(tsConfig, inject);
        this.#inject = {
            process: inject?.process ?? process,
            access:  inject?.access  ?? access
        };

        const cwd = this.#inject.process.cwd();
        this.#rootDir = resolve(cwd, tsConfig.value?.compilerOptions?.rootDir ?? '.') + sep;
        this.#outDir =  resolve(cwd, tsConfig.value?.compilerOptions?.outDir  ?? '.') + sep;
    }

    async #exists(path: string): Promise<boolean> {
        try {
            await this.#inject.access(path);
            return true;
        } catch {
            return false;
        }
    }

    async #customResolve(specifier: string, context: ResolveHookContext): Promise<string> {
        if (typeof context.parentURL !== 'string') {
            return specifier;
        }

        if (this.#cache.has(specifier)) {
            return this.#cache.get(specifier)!;
        }

        const parentDir = dirname(fileURLToPath(context.parentURL)) + sep;
        const paths = this.#pathAlias.find(specifier) ?? [];
        for (let path of paths) {
            if (parentDir.startsWith(this.#rootDir)) {
                path = path.replace(/(?<=\.m?)j(?=s$)/i, 't');
                if (await this.#exists(path)) {
                    this.#cache.set(specifier, path);
                    return path;
                }

            } else if (parentDir.startsWith(this.#outDir)) {
                path = replaceFromStart(path, this.#rootDir, this.#outDir)
                    .replace(/(?<=\.m?)t(?=s$)/i, 'j');

                if (await this.#exists(path)) {
                    this.#cache.set(specifier, path);
                    return path;
                }
            }
        }

        if (/\.m?(j|t)s$/i.test(specifier)) {
            const specifierTs = specifier.replace(/(?<=\.m?)j(?=s$)/i, 't');
            const fullPathTs = resolve(parentDir, specifierTs);
            if (await this.#exists(fullPathTs)) {
                this.#cache.set(specifier, specifierTs);
                return specifierTs;
            } else {
                this.#cache.set(specifier, specifier);
                return specifier;
            }

        } else {
            this.#cache.set(specifier, specifier);
            return specifier;
        }
    }

    async resolve(
        specifier: string,
        context: ResolveHookContext,
        defaultResolve: DefaultResolve
    ): Promise<ResolveFnOutput> {
        try {
            const defaultResult = await defaultResolve(specifier, context);
            return {
                ...defaultResult,
                shortCircuit: true
            };
        } catch {
            const customSpecifier = await this.#customResolve(specifier, context);
            return defaultResolve(customSpecifier, context);
        }
    }
}