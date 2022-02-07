import { Argv } from '../tool/arg-parser';

export interface Executable {
    start(argv: Argv, data: Record<string, string[]>): void | Promise<void>;
}