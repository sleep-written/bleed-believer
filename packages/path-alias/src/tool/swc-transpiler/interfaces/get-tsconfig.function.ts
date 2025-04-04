import type { TsConfigResult } from 'get-tsconfig';

export type GetTsconfigFunction = (
    searchPath?: string,
    configName?: string,
    cache?: Cache
) => TsConfigResult | null;