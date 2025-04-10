import type { TransformFileFunction } from './transform-file.function.js';
import type { WriteFileFunction } from './write-file.function.js';
import type { MkdirFunction } from './mkdir.function.js';

export interface SourceCodeInjection {
    transformFile: TransformFileFunction;
    writeFile: WriteFileFunction;
    mkdir: MkdirFunction;
}