import { load as tsNodeLoad } from 'ts-node/esm';
import { Resolver } from './resolver.js';

/**
 * Function used by the loader through `node --loader @bleed-believer/path-alias ./src/index.ts`.
 */
export function load(
    url:            string,
    context:        { format: string },
    defaultLoad:    typeof tsNodeLoad,
): Function {
    const res = Resolver.load(url);
    if (res.isTsNode) {
        return tsNodeLoad(res.url, context, defaultLoad);
    } else {
        return defaultLoad(res.url, context, defaultLoad);
    }
}