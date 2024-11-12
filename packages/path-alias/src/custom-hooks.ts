import type { LoadHook, ResolveHook } from 'module';
import { HookManager } from './hook-manager.js';

const hookManager = new HookManager();
export const load: LoadHook = async (url, context, defaultLoad) => {
    return hookManager.load(url, context, defaultLoad);
}

export const resolve: ResolveHook = async (specifier, context, defaultResolve) => {
    return hookManager.resolve(specifier, context, defaultResolve);
}