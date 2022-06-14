import { TsconfigOpts } from './tsconfig-opts.js';

export interface TsconfigMain {
    extends: string;
    compilerOptions: TsconfigOpts;
}
