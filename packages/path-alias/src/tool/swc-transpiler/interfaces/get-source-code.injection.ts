import type { FastGlobFunction } from './fast-glob.function.js';
import type { ProcessInstance } from './process.instance.js';

export interface GetSourceCodeInjection {
    fastGlob: FastGlobFunction;
    process: ProcessInstance;
}
