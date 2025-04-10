import type { GetSourceCodeInjection } from './get-source-code.injection.js';
import type { SourceCodeInstance } from './source-code.instance.js';
import type { TsConfigResult } from 'get-tsconfig';

export type GetSourceCodeFunction = (
    tsConfigResult: TsConfigResult,
    injection?: Partial<GetSourceCodeInjection>
) => Promise<SourceCodeInstance[]>;