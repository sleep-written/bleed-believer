import { ArgParser } from '../tool/arg-parser';

export interface Executable {
    start(argv: ArgParser): void | Promise<void>;
}