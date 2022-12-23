import { Context, resolve as tsNodeResolve } from 'ts-node/esm';
import { Resolver } from './core/resolver.js';

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
