import type { GetSourceCodeFunction } from './get-source-code.function.js';
import type { GetTsConfigFunction } from './get-ts-config.function.js';
import type { ProcessInstance } from './process.instance.js';

export interface SWCTranspilerInjection {
    getSourceCode: GetSourceCodeFunction;
    getTsConfig: GetTsConfigFunction;
    process: ProcessInstance;
}