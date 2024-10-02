import type { LoadHook, ResolveHook } from 'module';
import { CustomHooks } from './custom-hooks.js';

const customHooks = new CustomHooks();
export const load: LoadHook = (url, context, nextLoad) => {
    return customHooks.load(url, context, nextLoad);
}

export const resolve: ResolveHook = (specifier, context, nextResolve) => {
    return customHooks.resolve(specifier, context, nextResolve);
};
