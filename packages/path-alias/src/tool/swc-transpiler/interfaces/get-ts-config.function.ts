import type { GetTsConfigInjection } from '@tool/get-ts-config/index.js';
import type { TsConfigResult } from 'get-tsconfig';

export type GetTsConfigFunction = (
    path?: string | null,
    injection?: Partial<GetTsConfigInjection>
) => TsConfigResult;
