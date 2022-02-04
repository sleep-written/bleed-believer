import { Argv } from '../tool/arg-parser';

export interface Executable {
    start(argv: Argv): void | Promise<void>;
}