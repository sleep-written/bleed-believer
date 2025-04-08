import type { SourceCodeInstanceInjection } from './source-code.instance.injection.js';
import type { SourceCodeInstance } from './source-code.instance.js';
import type { TsConfigResult } from 'get-tsconfig';

export type GetSourceCodeFunction = (
    tsConfigResult: TsConfigResult,
    injection?: Partial<SourceCodeInstanceInjection>
) => Promise<SourceCodeInstance[]>;