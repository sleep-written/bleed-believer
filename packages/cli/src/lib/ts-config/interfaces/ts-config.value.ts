import type { CompilerOptions } from './compiler-options.js';

export interface TsConfigValue {
    extends?: string | string[];
    exclude?: string[];
    compilerOptions?: CompilerOptions | undefined;
}