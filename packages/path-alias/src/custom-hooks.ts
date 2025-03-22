import type { LoadHook, ResolveHook } from 'module';
import { HookManager } from './hook-manager.js';
import { TsConfig } from '@tool/ts-config/ts-config.js';

const argsFromEnv = JSON.parse(process.env.BLEED_BELIEVER_PATH_ALIAS_ARGS ?? '{}');

const tsConfig = TsConfig.load(
    process.cwd(),
    argsFromEnv['--bb-tsconfig-path']?.[0] ?? './tsconfig.json'
);
const hookManager = new HookManager(tsConfig);

export const load: LoadHook = async (url, context, defaultLoad) => {
    return hookManager.load(url, context, defaultLoad);
}

export const resolve: ResolveHook = async (specifier, context, defaultResolve) => {
    return hookManager.resolve(specifier, context, defaultResolve);
}