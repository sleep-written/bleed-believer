import { load as tsNodeLoad } from 'ts-node/esm';
import { Resolver } from './core/resolver.js';

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