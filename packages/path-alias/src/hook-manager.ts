import type { LoadFnOutput, LoadHookContext, ResolveFnOutput, ResolveHookContext } from 'module';
import type { Options as SwcOptions } from '@swc/core';

import { fileURLToPath, pathToFileURL } from 'url';
import { isBuiltin } from 'module';
import { transform } from '@swc/core';
import { resolve } from 'path';
import { access } from 'fs/promises';

import { isPackageInstalled } from '@tool/is-package-installed/index.js';
import { ExtParser } from '@tool/ext-parser/ext-parser.js';
import { TsConfig } from '@tool/ts-config/index.js';

type DefaultLoad = (
    url: string,
    context?: LoadHookContext
) => LoadFnOutput | Promise<LoadFnOutput>;

type DefaultResolve = (
    specifier: string,
    context?: ResolveHookContext
) => ResolveFnOutput | Promise<ResolveFnOutput>;

export class HookManager {
    #resolveCache = new Map<string, string>();
    #loadCache = new Map<string, LoadFnOutput>();
    #tsConfig = TsConfig.load();
    #swcrc?: SwcOptions;

    #rootDir = resolve(this.#tsConfig.cwd, this.#tsConfig.rootDir);
    #outDir = resolve(this.#tsConfig.cwd, this.#tsConfig.outDir);

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

    async resolve(
        specifier: string,
        context: ResolveHookContext,
        defaultResolve: DefaultResolve
    ): Promise<ResolveFnOutput> {
        if (typeof context.parentURL === 'string') {
            const cache = this.#resolveCache.get(specifier);
            if (typeof cache === 'string') {
                // Get the value stored in cache
                specifier = cache;

            } else if (isPackageInstalled(specifier)) {
                // Store the module specifier in cache
                this.#resolveCache.set(specifier, specifier);

            } else {
                const path = resolve(fileURLToPath(context.parentURL), '..', specifier);
                if (!await this.#fileExist(path)) {
                    // Recalculate using outDir and rootDir
                    const tsPath = new ExtParser(path).toTs().replace(this.#outDir, this.#rootDir);
                    const jsPath = new ExtParser(path).toJs().replace(this.#rootDir, this.#outDir);
                    if (await this.#fileExist(tsPath)) {
                        specifier = new ExtParser(specifier).toTs();
    
                    } else if (await this.#fileExist(jsPath)) {
                        specifier = new ExtParser(specifier).toJs();
    
                    } else if (jsPath.startsWith(this.#outDir)) {
                        // Resolve using tsconfig path alias
                        const promisePaths = this.#tsConfig
                            .resolveAll(specifier, true)
                            .map(async x => [ x, await this.#fileExist(x) ] as const);
        
                        const resolvedPath = (await Promise.all(promisePaths))
                            ?.find(([ _, exist ]) => exist)
                            ?.[0];
        
                        if (typeof resolvedPath === 'string') {
                            const href = pathToFileURL(resolvedPath).href;
                            this.#resolveCache.set(specifier, href);
                            specifier = href;
                        }
                    }
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