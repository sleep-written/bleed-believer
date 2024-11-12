import type { LoadFnOutput, LoadHookContext, ResolveFnOutput, ResolveHookContext } from 'module';
import type { Options as SwcOptions } from '@swc/core';

import { fileURLToPath } from 'url';
import { isBuiltin } from 'module';
import { transform } from '@swc/core';
import { resolve } from 'path';
import { access } from 'fs/promises';

import { TsConfig } from './tool/ts-config/index.js';

type DefaultLoad = (
    url: string,
    context?: LoadHookContext
) => LoadFnOutput | Promise<LoadFnOutput>;

type DefaultResolve = (
    specifier: string,
    context?: ResolveHookContext
) => ResolveFnOutput | Promise<ResolveFnOutput>;

export class HookManager {
    #loadCache = new Map<string, LoadFnOutput>();
    #tsConfig = TsConfig.load();
    #swcrc?: SwcOptions;

    async #fileExist(path: string): Promise<boolean> {
        try {
            await access(path);
            return true;
        } catch {
            return false;
        }
    }

    #isURL(input: string): boolean {
        try {
            new URL(input);
            return true;
        } catch {
            return false;
        }
    }

    #toTs(input: string): string {
        return input.replace(/(?<=\.(m|c)?)j(?=(sx?)$)/gi, 't');
    }

    #toJs(input: string): string {
        return input.replace(/(?<=\.(m|c)?)t(?=(sx?)$)/gi, 'j');
    }

    async resolve(
        specifier: string,
        context: ResolveHookContext,
        defaultResolve: DefaultResolve
    ): Promise<ResolveFnOutput> {
        if (typeof context.parentURL === 'string') {
            const pathTs = resolve(
                fileURLToPath(context.parentURL),
                '..', this.#toTs(specifier)
            );

            if (await this.#fileExist(pathTs)) {
                specifier = this.#toTs(specifier);
            } else {
                const pathJs = this.#toJs(pathTs);
                if (await this.#fileExist(pathJs)) {
                    specifier = this.#toJs(specifier);
                }
            }
        }

        return defaultResolve(specifier, context);
    }

    async load(
        url: string,
        context: LoadHookContext,
        defaultLoad: DefaultLoad
    ): Promise<LoadFnOutput> {
        let out = this.#loadCache.get(url);
        if (out) {
            return out;
        }

        if (this.#isURL(url) && !isBuiltin(url)) {
            const path = fileURLToPath(url);
            const rootDir = resolve(this.#tsConfig.cwd, this.#tsConfig.rootDir);
            if (path.startsWith(rootDir)) {
                if (!this.#swcrc) {
                    this.#swcrc = this.#tsConfig.toSwcConfig();
                    this.#swcrc.inlineSourcesContent = true;
                    this.#swcrc.outputPath = resolve(this.#tsConfig.cwd, this.#tsConfig.outDir);
                    this.#swcrc.sourceMaps = 'inline';
                }

                const localSwcConfig = structuredClone(this.#swcrc);
                localSwcConfig.sourceFileName = path;
                localSwcConfig.filename = localSwcConfig.sourceFileName;

                const original = await defaultLoad(url, { ...context, format: 'module' });
                const rawText = (original.source as Buffer).toString('utf-8');
                const result = await transform(rawText, localSwcConfig);
                out = {
                    format: 'module',
                    source: result.code,
                    shortCircuit: true
                };

                this.#loadCache.set(url, out);
                return out;
            }
        }
        
        out = await defaultLoad(url, context);
        this.#loadCache.set(url, out);
        return out;
    }
}