/// <reference path="../../types/ts-node.d.ts" />
import type { Context } from 'ts-node/esm';

import { resolve as tsNodeResolve } from 'ts-node/esm';
import { Resolver } from './resolver.js';

/**
 * Function used by the loader through `node --loader @bleed-believer/path-alias ./src/index.ts`.
 */
export function resolve(
    specifier: string,
    context: Context,
    defaultResolve: typeof tsNodeResolve
): Promise<{ url: string }> {
    const resolver = new Resolver(specifier);
    const res = resolver.resolve();
    if (res.isTsNode) {
        return tsNodeResolve(res.specifier, context, defaultResolve);
    } else {
        return defaultResolve(res.specifier, context, defaultResolve);
    }
}
