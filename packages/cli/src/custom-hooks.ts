import type { LoadHook, ResolveHook } from 'module';

import { TSConfig } from '@lib/ts-config/index.js';
import { LoadCustomHook } from '@lib/load-custom-hook/index.js';
import { ResolveCustomHook } from '@lib/resolve-custom-hook/index.js';

const tsConfig = await TSConfig.load();
const loadHook = new LoadCustomHook(tsConfig);
const resolveHook = new ResolveCustomHook(tsConfig);

export const load: LoadHook = async (url, context, defaultLoad) => {
    return loadHook.load(url, context, defaultLoad);
}

export const resolve: ResolveHook = async (specifier, context, defaultResolve) => {
    return resolveHook.resolve(specifier, context, defaultResolve);
};