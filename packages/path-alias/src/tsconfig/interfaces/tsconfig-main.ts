import type { TsconfigOpts } from './tsconfig-opts.js';

export interface TsconfigMain {
    extends: string | string[];
    compilerOptions: TsconfigOpts;
}
