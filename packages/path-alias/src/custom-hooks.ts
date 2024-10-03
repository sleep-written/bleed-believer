import type { LoadFnOutput, LoadHookContext, ResolveFnOutput, ResolveHookContext } from 'module';
import type { NextLoad, NextResolver } from 'ts-node/esm';

import { fileURLToPath as originalFileURLToPath } from 'url';
import { getTsconfig as originalGetTsconfig } from 'get-tsconfig';
import * as tsNode from 'ts-node/esm';

import { markAsTsNode } from './tool/path-resolve/index.js';
import { isFileUrl } from './tool/is-file-url/index.js';
import { PathAlias } from './tool/path-alias/index.js';
import { logger } from './logger.js';

/**
 * Interface to define the dependencies that can be injected into CustomHooks.
 * This allows for easier mocking and testing.
 */
interface CustomHooksDependencies {
    getTsconfig?: typeof originalGetTsconfig;
    fileURLToPath?: typeof originalFileURLToPath;
    PathAliasClass?: typeof PathAlias;

    cwd?: () => string;
    tsNodeLoadFn?: typeof tsNode.load;
    tsNodeResolveFn?: typeof tsNode.resolve;
}

/**
 * CustomHooks class integrates with ts-node's ESM loader hooks.
 * It utilizes PathAlias to resolve module paths based on tsconfig paths.
 */
export class CustomHooks {
    #cwd: () => string;
    #pathAlias!: PathAlias;
    #getTsconfig: typeof originalGetTsconfig;
    #tsNodeLoadFn: typeof tsNode.load;
    #fileURLToPath: typeof originalFileURLToPath;
    #PathAliasClass: typeof PathAlias;
    #tsNodeResolveFn: typeof tsNode.resolve;

    /**
     * Constructor allows injecting dependencies for easier testing.
     * If no dependencies are provided, it defaults to the actual implementations.
     * 
     * @param dependencies - An object containing optional dependencies to override defaults.
     */
    constructor(dependencies: CustomHooksDependencies = {}) {
        this.#cwd = dependencies.cwd ?? (() => process.cwd());
        this.#getTsconfig = dependencies.getTsconfig ?? originalGetTsconfig;
        this.#tsNodeLoadFn = dependencies.tsNodeLoadFn ?? tsNode.load;
        this.#fileURLToPath = dependencies.fileURLToPath ?? originalFileURLToPath;
        this.#PathAliasClass = dependencies.PathAliasClass ?? PathAlias;
        this.#tsNodeResolveFn = dependencies.tsNodeResolveFn ?? tsNode.resolve;
    }

    /**
     * Initialize PathAlias if it hasn't been initialized yet.
     * This ensures that PathAlias is only initialized once.
     */
    private async initializePathAlias(url: string): Promise<PathAlias> {
        const cwd = this.#cwd();
        const entryPoint = this.#fileURLToPath(url);

        const tsconfigResult = this.#getTsconfig(cwd);
        const tsconfig = tsconfigResult?.config;

        if (!tsconfig) {
            throw new Error(`Unable to load tsconfig.json from directory: ${cwd}`);
        }

        return new this.#PathAliasClass(tsconfig, { cwd, entryPoint });
    }

    /**
     * Load hook implementation that delegates to ts-node's original load function.
     * 
     * @param url - The URL of the module to load.
     * @param context - The context of the load operation.
     * @param nextLoad - The next load hook in the chain.
     * @returns The result of the load operation.
     */
    load(
        url: string,
        context: LoadHookContext,
        nextLoad: NextLoad
    ): LoadFnOutput | Promise<LoadFnOutput> {
        if (this.#pathAlias && this.#pathAlias.isInsideSrc(url)) {
            return this.#tsNodeLoadFn(url, context, nextLoad);
        } else {
            return nextLoad(url, context);
        }
    }

    /**
     * Resolve hook implementation that uses PathAlias to resolve module paths based on tsconfig paths.
     * If PathAlias is not yet initialized and the specifier is a file URL, it initializes PathAlias.
     * 
     * @param specifier - The module specifier to resolve.
     * @param context - The context of the resolve operation.
     * @param nextResolve - The next resolve hook in the chain.
     * @returns The result of the resolve operation.
     */
    async resolve(
        specifier: string,
        context: ResolveHookContext,
        nextResolve: NextResolver
    ): Promise<ResolveFnOutput> {
        try {
            // If specifier is a file URL, initialize PathAlias if not already done
            if (!this.#pathAlias) {
                if (isFileUrl(specifier)) {
                    this.#pathAlias = await this.initializePathAlias(specifier);
                }

                return nextResolve(specifier, context);
            }
            
            // Resolve path alias
            let isTsNode = false;
            specifier = await this.#pathAlias?.resolveSpecifier(specifier, context);
            if (this.#pathAlias.isInsideSrc(specifier)) {
                isTsNode = true;
                markAsTsNode();
            }

            if (isTsNode) {
                return this.#tsNodeResolveFn(specifier, context, nextResolve);
            } else {
                return nextResolve(specifier, context);
            }
        } catch (err: any) {
            logger.error(err?.message);
            return nextResolve(specifier, context);
        }
    }
}
